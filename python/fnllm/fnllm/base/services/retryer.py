# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation."""

from __future__ import annotations

import asyncio
from abc import abstractmethod
from typing import TYPE_CHECKING, Any, Generic

from tenacity import (
    AsyncRetrying,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential_jitter,
)
from typing_extensions import Unpack

from fnllm.base.config import RetryStrategy
from fnllm.base.services.errors import RetriesExhaustedError
from fnllm.types.generics import (
    THistoryEntry,
    TInput,
    TJsonModel,
    TModelParameters,
    TOutput,
)
from fnllm.types.metrics import LLMRetryMetrics

from .decorator import LLMDecorator

if TYPE_CHECKING:
    from collections.abc import Awaitable, Callable, Sequence

    from fnllm.events import LLMEvents
    from fnllm.types.io import LLMInput, LLMOutput


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
        events: LLMEvents,
        retry_strategy: RetryStrategy,
    ):
        """Create a new RetryingLLM."""
        self._retryable_errors = retryable_errors
        self._tag = tag
        self._max_retries = max_retries
        self._max_retry_wait = max_retry_wait
        self._retry_strategy = retry_strategy
        self._events = events

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
            num_retries = 0
            call_times = []
            start = asyncio.get_event_loop().time()

            if self._retry_strategy == RetryStrategy.TENACITY:
                result, call_times, num_retries = await self._execute_with_retry(
                    delegate, prompt, **kwargs
                )
            else:
                result = await delegate(prompt, **kwargs)

            end = asyncio.get_event_loop().time()
            result.metrics.retry = LLMRetryMetrics(
                total_time=end - start,
                num_retries=num_retries,
                call_times=call_times,
            )
            await self._events.on_success(result.metrics)

            return result

        return invoke

    async def _execute_with_retry(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
        prompt: TInput,
        **kwargs: Unpack[LLMInput[Any, Any, Any]],
    ) -> tuple[LLMOutput[TOutput, TJsonModel, THistoryEntry], list[float], int]:
        name = kwargs.get("name", self._tag)
        call_times: list[float] = []
        attempt_number = 0

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

        try:
            async for a in AsyncRetrying(
                stop=stop_after_attempt(self._max_retries),
                wait=wait_exponential_jitter(max=self._max_retry_wait),
                reraise=True,
                retry=retry_if_exception_type(tuple(self._retryable_errors)),
            ):
                with a:
                    attempt_number += 1
                    result = await attempt()
                    return result, call_times, attempt_number - 1
        except BaseException as error:
            if not isinstance(error, tuple(self._retryable_errors)):
                raise

        raise RetriesExhaustedError(name, self._max_retries)
