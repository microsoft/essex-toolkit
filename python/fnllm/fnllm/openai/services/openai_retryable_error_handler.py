# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation for OpenAI."""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING, Final

from openai import APIConnectionError, InternalServerError, RateLimitError

from fnllm.base.services.errors import InvalidLLMResultError
from fnllm.openai.errors import OpenAINoChoicesAvailableError

if TYPE_CHECKING:
    from httpx import Response


OPENAI_RETRYABLE_ERRORS: Final[list[type[Exception]]] = [
    RateLimitError,
    APIConnectionError,
    InternalServerError,
    OpenAINoChoicesAvailableError,
    InvalidLLMResultError,
]


class OpenAIRetryableErrorHandler:
    """A base class to rate limit the LLM."""

    async def __call__(self, error: BaseException) -> None:
        """Handle the rate limit error."""
        if hasattr(error, "response"):
            res: Response = error.response
            retry_after = res.headers.get("retry-after", None)
            if retry_after is not None:
                retry_after = int(retry_after)
                await asyncio.sleep(retry_after)
