# Copyright (c) 2024 Microsoft Corporation.
"""Process a function graph."""

from __future__ import annotations

import asyncio
import logging
from abc import ABC, abstractmethod
from asyncio import Future
from dataclasses import dataclass, field
from typing import Generic, TypeVar

_log = logging.getLogger(__name__)


CallInput = TypeVar("CallInput")
CallOutput = TypeVar("CallOutput")


class BatchResponseInvalidError(RuntimeError):
    """An error raised when a batch response is invalid."""

    def __init__(self, expected: int, actual: int) -> None:
        super().__init__(f"Expected {expected} responses, got {actual}")


@dataclass
class Call(Generic[CallInput, CallOutput]):
    """A call to a remote service."""

    input: CallInput
    """The prompt for the call."""

    cost: int
    """A cost value for the call. Usually a token count."""

    response: Future[CallOutput] = field(default_factory=Future)
    """The response to the call."""


@dataclass
class CallBatch(Generic[CallInput, CallOutput]):
    """A batch of calls to a remote service."""

    calls: list[Call[CallInput, CallOutput]] = field(default_factory=list)
    future: Future[None] = field(default_factory=Future)

    @property
    def cost(self) -> int:
        """Return the number of tokens in the batch."""
        return sum(call.cost for call in self.calls)

    @property
    def num_calls(self) -> int:
        """Return the number of calls in the batch."""
        return len(self.calls)

    def on_response(self, response: list[CallOutput]) -> None:
        """Set the response."""
        if len(response) != len(self.calls):
            raise BatchResponseInvalidError(len(self.calls), len(response))
        for call, embedding in zip(self.calls, response, strict=True):
            call.response.set_result(embedding)


class Batcher(ABC, Generic[CallInput, CallOutput]):
    """A utility class to batch calls."""

    def __init__(
        self,
        *,
        max_batch_size: int,
        max_batch_cost: int,
    ) -> None:
        self._batch_futures: list[Future] = []
        self._max_batch_size = max_batch_size
        self._max_batch_cost = max_batch_cost
        self._current_batch = CallBatch()

    @property
    def max_batch_size(self) -> int:
        """Return the maximum batch size."""
        return self._max_batch_size

    @property
    def max_batch_cost(self) -> int:
        """Return the maximum batch cost."""
        return self._max_batch_cost

    def __call__(self, content: CallInput) -> Future[CallOutput]:
        """Generate embeddings some content, batching internally to maximize throughput."""
        cost = self._compute_cost(content)
        call = Call(input=content, cost=cost)

        if not self._can_add_to_batch(call):
            self._submit_inflight_batch()

        self._current_batch.calls.append(call)
        return call.response

    async def flush(self) -> None:
        """Finish any inflight calls."""
        self._submit_inflight_batch()

        futures = self._batch_futures
        self._batch_futures = []
        await asyncio.gather(*futures)

    def _can_add_to_batch(self, call: Call) -> bool:
        new_cost = self._current_batch.cost + call.cost
        return (
            self._current_batch.num_calls < self.max_batch_size
            and new_cost <= self._max_batch_cost
        )

    def _submit_inflight_batch(self) -> None:
        batch = self._current_batch
        if batch.num_calls > 0:
            batch.future = asyncio.create_task(self._process_batch(batch))
            self._batch_futures.append(batch.future)
            self._current_batch = CallBatch()

    async def _process_batch(
        self, batch: CallBatch[CallInput, CallOutput] | None
    ) -> None:
        _log.debug(
            "Processing batch with %d calls",
            batch.num_calls if batch is not None else -1,
        )
        if batch is not None:
            response = await self._invoke(batch)
            batch.on_response(response)

    @abstractmethod
    def _compute_cost(self, content: CallInput) -> int:
        """Compute the cost of a call."""

    @abstractmethod
    async def _invoke(
        self, batch: CallBatch[CallInput, CallOutput]
    ) -> list[CallOutput]:
        """Process a batch."""
