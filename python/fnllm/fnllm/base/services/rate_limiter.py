# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation."""

from __future__ import annotations

from collections.abc import Callable
from contextlib import contextmanager
from typing import TYPE_CHECKING, Any, Generic

from typing_extensions import Unpack

from fnllm.limiting import Limiter, Manifest
from fnllm.types.generics import TInput, TJsonModel, TModelParameters
from fnllm.types.io import LLMInput

from .decorator import LLMDecorator, THistoryEntry, TOutput

if TYPE_CHECKING:
    from fnllm.events.base import LLMEvents
    from fnllm.types.io import LLMOutput

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
        estimator: TokenEstimator,
    ):
        """Create a new BaseRateLimitLLM."""
        self._limiter = limiter
        self._events = events
        self._estimator = estimator

    def estimate_request_tokens(self, prompt: TInput, kwargs: LLMInput) -> int:
        """Estimate the number of tokens needed for an OpenAI request."""
        return self._estimator(prompt, kwargs)

    async def update_response(
        self,
        result: LLMOutput[TOutput, TJsonModel, THistoryEntry],
        estimated_input_tokens: int,
    ) -> None:
        """Handle the post-request limiting."""
        result.metrics.estimated_input_tokens = estimated_input_tokens
        diff = result.metrics.tokens_diff

        if diff > 0:
            manifest = Manifest(post_request_tokens=diff)
            # consume the token difference
            async with self._limiter.use(manifest):
                await self._events.on_post_limit(manifest)

    @contextmanager
    async def limit(
        self,
        estimated_input_tokens: int,
        prompt: TInput,
        **args: Unpack[LLMInput[Any, Any, Any]],
    ):
        """Limit the rate of the LLM."""
        manifest = Manifest(request_tokens=estimated_input_tokens)
        try:
            with self._limiter.use(manifest):
                await self._events.on_limit_acquired(manifest)
                yield
        finally:
            await self._events.on_limit_released(manifest)
