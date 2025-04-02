# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation."""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import TYPE_CHECKING, Any, Generic

from typing_extensions import Unpack

from fnllm.limiting import Limiter, Manifest
from fnllm.types.generics import TInput, TJsonModel, TModelParameters
from fnllm.types.io import LLMInput, LLMOutput

from .decorator import LLMDecorator, THistoryEntry, TOutput

if TYPE_CHECKING:
    from fnllm.events.base import LLMEvents

TokenEstimator = Callable[
    [TInput, LLMInput[TJsonModel, THistoryEntry, TModelParameters]], int
]


class RateLimiter(
    LLMDecorator[TOutput, THistoryEntry],
    Generic[TInput, TOutput, THistoryEntry, TModelParameters],
):
    """A base class to rate limit the LLM."""

    def __init__(
        self,
        limiter: Limiter,
        *,
        events: LLMEvents,
        estimator: TokenEstimator[TInput, TJsonModel, THistoryEntry, TModelParameters],
    ):
        """Create a new BaseRateLimitLLM."""
        self._limiter = limiter
        self._events = events
        self._estimator = estimator

    def decorate(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
    ) -> Callable[..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]]:
        """Execute the LLM with the configured rate limits."""

        async def invoke(prompt: TInput, **args: Unpack[LLMInput[Any, Any, Any]]):
            estimated_input_tokens = self._estimator(prompt, args)

            manifest = Manifest(request_tokens=estimated_input_tokens)
            try:
                async with self._limiter.use_before(manifest):
                    await self._events.on_limit_acquired(manifest)
                    result = await delegate(prompt, **args)
            finally:
                await self._events.on_limit_released(manifest)

            # Set the estimated input tokens
            result.metrics.estimated_input_tokens = estimated_input_tokens

            # Post-Request limiting
            if result.metrics.tokens_diff > 0:
                manifest = Manifest(post_request_tokens=result.metrics.tokens_diff)
                # consume the token difference
                async with self._limiter.use_after(manifest, output=result):
                    await self._events.on_post_limit(manifest)

            return result

        return invoke
