# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation for OpenAI."""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING, Final

from openai import (
    APIConnectionError,
    APIStatusError,
    InternalServerError,
    RateLimitError,
)

from fnllm.base.services.errors import InvalidLLMResultError
from fnllm.limiting.base import Limiter
from fnllm.openai.config import OpenAIRateLimitBehavior
from fnllm.openai.errors import OpenAINoChoicesAvailableError

if TYPE_CHECKING:
    from fnllm.limiting.types import Manifest

OPENAI_RETRYABLE_ERRORS: Final[list[type[Exception]]] = [
    RateLimitError,
    APIConnectionError,
    InternalServerError,
    OpenAINoChoicesAvailableError,
    InvalidLLMResultError,
]


class OpenAIBackoffLimiter(Limiter):
    """
    OpenAI Backoff Limiter.

    This limiter is used in tandem with the OpenAI Reetryable Error Handler to ensure that when
    429 errors are encountered, the running loop will pause for the amount of time specified in the
    retry-after header before allowing requests to clear the limiters.

    Any in-flight requests will be allowed to complete, but no new requests will be allowed to start
    until the delay has passed.
    """

    def __init__(self) -> None:
        """Create a new OpenAIBackoffLimiter."""
        self._delay_event = asyncio.Event()  # Event to control access
        self._delay_event.set()  # Initially allow acquire() calls

    async def acquire(self, manifest: Manifest) -> None:
        """Acquire a pass through the limiter."""
        await self._delay_event.wait()  # Wait until the event is set

    async def release(self, manifest: Manifest) -> None:
        """Release a pass through the limiter."""
        # No-op in this implementation, but can be extended if needed.

    async def sleep_for(self, time: float) -> None:
        """Sleep for the given amount of time."""
        self._delay_event.clear()  # Block acquire() calls
        try:
            await asyncio.sleep(time)
        finally:
            self._delay_event.set()


class OpenAIRetryableErrorHandler:
    """A base class to rate limit the LLM."""

    def __init__(
        self, limiter: OpenAIBackoffLimiter, strategy: OpenAIRateLimitBehavior
    ) -> None:
        """Create a new OpenAIRetryableErrorHandler."""
        self._limiter = limiter
        self._strategy = strategy

    async def __call__(self, error: BaseException) -> None:
        """Handle the rate limit error."""
        match error:
            case APIStatusError():
                retry_after = error.response.headers.get("retry-after", None)
                if retry_after is not None:
                    await self._handle_retry_after(float(retry_after))
            case _:
                pass

    async def _handle_retry_after(self, retry_after: float) -> None:
        """Handle the retry after header."""
        match self._strategy:
            case OpenAIRateLimitBehavior.LIMIT:
                await self._limiter.sleep_for(retry_after)
            case OpenAIRateLimitBehavior.SLEEP:
                await asyncio.sleep(retry_after)
            case OpenAIRateLimitBehavior.NONE:
                pass
