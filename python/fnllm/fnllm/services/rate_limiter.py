# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation."""

from abc import abstractmethod
from collections.abc import Awaitable, Callable
from typing import Any, Generic

from typing_extensions import Unpack

from fnllm.events.base import LLMEvents
from fnllm.limiting import Limiter, Manifest
from fnllm.types.generics import TInput, TJsonModel, TModelParameters
from fnllm.types.io import LLMInput, LLMOutput

from .decorator import LLMDecorator, THistoryEntry, TOutput


class RateLimiter(
    LLMDecorator[TOutput, THistoryEntry],
    Generic[TInput, TOutput, THistoryEntry, TModelParameters],
):
    """A base class to rate limit the LLM."""

    def __init__(
        self,
        limiter: Limiter,
        *,
        events: LLMEvents | None = None,
    ):
        """Create a new BaseRateLimitLLM."""
        self._limiter = limiter
        self._events = events or LLMEvents()

    @abstractmethod
    def _estimate_request_tokens(
        self,
        prompt: TInput,
        kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters],
    ) -> int:
        """Estimate how many tokens are on the request input."""

    async def _handle_post_request_limiting(
        self,
        result: LLMOutput[TOutput, TJsonModel, THistoryEntry],
    ) -> None:
        diff = result.metrics.tokens_diff

        if diff > 0:
            manifest = Manifest(post_request_tokens=diff)
            # consume the token difference
            async with self._limiter.use(manifest):
                await self._events.on_post_limit(manifest)

    def decorate(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
    ) -> Callable[..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]]:
        """Execute the LLM with the configured rate limits."""

        async def invoke(prompt: TInput, **args: Unpack[LLMInput[Any, Any, Any]]):
            estimated_input_tokens = self._estimate_request_tokens(prompt, args)

            manifest = Manifest(request_tokens=estimated_input_tokens)
            try:
                async with self._limiter.use(manifest):
                    await self._events.on_limit_acquired(manifest)
                    result = await delegate(prompt, **args)
            finally:
                await self._events.on_limit_released(manifest)

            result.metrics.estimated_input_tokens = estimated_input_tokens
            await self._handle_post_request_limiting(result)

            return result

        return invoke
