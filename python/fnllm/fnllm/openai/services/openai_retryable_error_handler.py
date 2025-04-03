# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation for OpenAI."""

from __future__ import annotations

import asyncio
from typing import Final

from openai import (
    APIConnectionError,
    APIStatusError,
    InternalServerError,
    RateLimitError,
)

from fnllm.base.services.errors import InvalidLLMResultError
from fnllm.events.logger import LOGGER
from fnllm.openai.errors import OpenAINoChoicesAvailableError

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
        if isinstance(error, APIStatusError):
            retry_after = error.response.headers.get("retry-after", None)
            LOGGER.info(
                "ERROR, retryafter %s; headers=%s", retry_after, error.response.headers
            )
            if retry_after is not None:
                retry_after = int(retry_after)
                await asyncio.sleep(retry_after)
