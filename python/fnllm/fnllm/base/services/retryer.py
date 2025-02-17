# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation."""

from __future__ import annotations

import asyncio
from collections.abc import Awaitable, Callable, Sequence
from typing import TYPE_CHECKING, Any, Generic

from tenacity import (
    AsyncRetrying,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential_jitter,
    wait_incrementing,
    wait_random,
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
    from tenacity.wait import wait_base

    from fnllm.events import LLMEvents
    from fnllm.types.io import LLMInput, LLMOutput

RetryableErrorHandler = Callable[[BaseException], Awaitable[None]]


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
        retryable_error_handler: RetryableErrorHandler | None,
    ):
        """Create a new RetryingLLM."""
        self._retryable_errors = tuple(retryable_errors)
        self._tag = tag
        self._max_retries = max_retries
        self._events = events
        self._retryable_error_handler = retryable_error_handler

        self._retry_stop = stop_after_attempt(max_retries)
        self._retry_if = retry_if_exception_type(self._retryable_errors)
        self._wait_strategy = self._create_wait_strategy(retry_strategy, max_retry_wait)

    def _create_wait_strategy(
        self, retry_strategy: RetryStrategy, max_retry_wait: float
    ) -> wait_base:
        match retry_strategy:
            case RetryStrategy.EXPONENTIAL_BACKOFF:
                return wait_exponential_jitter(max=max_retry_wait)
            case RetryStrategy.INCREMENTAL_WAIT:
                return wait_incrementing(
                    max=max_retry_wait, increment=max_retry_wait / 10
                )
            case RetryStrategy.RANDOM_WAIT:
                return wait_random(max=max_retry_wait)
            case _:
                msg = f"Invalid retry strategy: {retry_strategy}"
                raise ValueError(msg)

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
            result, call_times, num_retries = await self._execute_with_retry(
                delegate, prompt, kwargs
            )
            result.metrics.retry = LLMRetryMetrics(
                total_time=asyncio.get_event_loop().time() - start,
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
        kwargs: LLMInput[Any, Any, Any],
    ) -> tuple[LLMOutput[TOutput, TJsonModel, THistoryEntry], list[float], int]:
        name = kwargs.get("name", self._tag)
        call_times: list[float] = []
        attempt_number = 0

        retry_manager = AsyncRetrying(
            stop=self._retry_stop,
            wait=self._wait_strategy,
            retry=self._retry_if,
            reraise=True,
        )
        try:
            async for attempt in retry_manager:
                with attempt:
                    attempt_number += 1
                    call_start = asyncio.get_event_loop().time()
                    try:
                        await self._events.on_try(attempt_number)
                        result = await delegate(prompt, **kwargs)
                    except BaseException as error:
                        call_times.append(asyncio.get_event_loop().time() - call_start)
                        #
                        # Try Send a notification about a retryable error occurring.
                        #
                        if isinstance(error, self._retryable_errors):
                            await self._events.on_retryable_error(error, attempt_number)
                            if self._retryable_error_handler is not None:
                                await self._retryable_error_handler(error)
                        else:
                            await self._events.on_non_retryable_error(
                                error, attempt_number
                            )
                        raise
                    else:
                        call_times.append(asyncio.get_event_loop().time() - call_start)
                        if attempt_number > 1:
                            await self._events.on_recover_from_error(attempt_number)
                        return result, call_times, attempt_number - 1

        except BaseException as error:
            if isinstance(error, self._retryable_errors):
                raise RetriesExhaustedError(name, self._max_retries) from error
            raise
        raise RetriesExhaustedError(name, self._max_retries)
