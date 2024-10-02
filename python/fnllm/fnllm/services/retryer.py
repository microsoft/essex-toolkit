# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation."""

import asyncio
from abc import abstractmethod
from collections.abc import Awaitable, Callable, Sequence
from typing import Any, Generic

from tenacity import (
    AsyncRetrying,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential_jitter,
)
from typing_extensions import Unpack

from fnllm.events.base import LLMEvents
from fnllm.services.errors import RetriesExhaustedError
from fnllm.types.generics import (
    THistoryEntry,
    TInput,
    TJsonModel,
    TModelParameters,
    TOutput,
)
from fnllm.types.io import LLMInput, LLMOutput
from fnllm.types.metrics import LLMRetryMetrics

from .decorator import LLMDecorator


class Retryer(
    LLMDecorator[TOutput, THistoryEntry],
    Generic[TInput, TOutput, THistoryEntry, TModelParameters],
):
    """A base class to add retries to an llm."""

    def __init__(
        self,
        *,
        retryable_errors: Sequence[type[Exception]],
        tag: str = "RetryingLLM",
        max_retries: int = 10,
        max_retry_wait: float = 10,
        events: LLMEvents | None = None,
    ):
        """Create a new RetryingLLM."""
        self._retryable_errors = retryable_errors
        self._tag = tag
        self._max_retries = max_retries
        self._max_retry_wait = max_retry_wait
        self._events = events or LLMEvents()

    @abstractmethod
    async def _on_retryable_error(self, error: BaseException) -> None:
        """Called as soon as retryable error happen."""

    def decorate(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
    ) -> Callable[..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]]:
        """Execute the LLM with the configured rate limits."""

        async def invoke(prompt: TInput, **kwargs: Unpack[LLMInput[Any, Any, Any]]):
            name = kwargs.get("name", self._tag)
            attempt_number = 0
            call_times: list[float] = []

            async def attempt() -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
                nonlocal call_times
                call_start = asyncio.get_event_loop().time()

                try:
                    await self._events.on_try(attempt_number)
                    return await delegate(prompt, **kwargs)
                except BaseException as error:
                    if isinstance(error, tuple(self._retryable_errors)):
                        await self._events.on_retryable_error(error, attempt_number)
                        await self._on_retryable_error(error)
                    raise
                finally:
                    call_end = asyncio.get_event_loop().time()
                    call_times.append(call_end - call_start)

            async def execute_with_retry() -> LLMOutput[
                TOutput, TJsonModel, THistoryEntry
            ]:
                nonlocal attempt_number
                try:
                    async for a in AsyncRetrying(
                        stop=stop_after_attempt(self._max_retries),
                        wait=wait_exponential_jitter(max=self._max_retry_wait),
                        reraise=True,
                        retry=retry_if_exception_type(tuple(self._retryable_errors)),
                    ):
                        with a:
                            attempt_number += 1
                            return await attempt()
                except BaseException as error:
                    if not isinstance(error, tuple(self._retryable_errors)):
                        raise

                raise RetriesExhaustedError(name, self._max_retries)

            start = asyncio.get_event_loop().time()
            result = await execute_with_retry()
            end = asyncio.get_event_loop().time()

            result.metrics.retry = LLMRetryMetrics(
                num_retries=attempt_number - 1,
                total_time=end - start,
                call_times=call_times,
            )

            await self._events.on_success(result.metrics)

            return result

        return invoke
