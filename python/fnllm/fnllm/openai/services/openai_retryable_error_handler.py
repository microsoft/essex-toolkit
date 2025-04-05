# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation for OpenAI."""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING, Final, cast

from openai import (
    APIConnectionError,
    APIStatusError,
    InternalServerError,
    RateLimitError,
)

from fnllm.base.services.errors import InvalidLLMResultError
from fnllm.limiting.base import Limiter
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
    """A base class to rate limit the LLM."""

    def __init__(self) -> None:
        """Create a new OpenAIBackoffLimiter."""
        self._delay: asyncio.Future[None] | None = None

    async def acquire(self, manifest: Manifest) -> None:
        """Acquire a pass through the limiter."""
        if self._delay is not None:
            await self._delay
            self._delay = None

    async def release(self, manifest: Manifest) -> None:
        """Release a pass through the limiter."""

    def sleep_for(self, time: int) -> None:
        """Sleep for the given amount of time."""
        self._delay = cast(asyncio.Future[None], asyncio.sleep(time))


class OpenAIRetryableErrorHandler:
    """A base class to rate limit the LLM."""

    def __init__(self, limiter: OpenAIBackoffLimiter) -> None:
        """Create a new OpenAIRetryableErrorHandler."""
        self._limiter = limiter

    async def __call__(self, error: BaseException) -> None:
        """Handle the rate limit error."""
        if isinstance(error, APIStatusError):
            retry_after = error.response.headers.get("retry-after", None)
            if retry_after is not None:
                self._limiter.sleep_for(int(retry_after))
