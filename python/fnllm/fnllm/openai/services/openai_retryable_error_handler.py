# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation for OpenAI."""

from __future__ import annotations

import asyncio
from typing import Final

from openai import APIConnectionError, InternalServerError, RateLimitError

from fnllm.base.services.errors import InvalidLLMResultError
from fnllm.errors import OpenAINoChoicesAvailableError

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
        sleep_recommendation = self._extract_sleep_recommendation(error)
        if sleep_recommendation > 0:
            await asyncio.sleep(sleep_recommendation)

    def _extract_sleep_recommendation(self, error: BaseException) -> float:
        """Extract the sleep time value from a RateLimitError. This is usually only available in Azure."""
        please_retry_after_msg: Final = "Rate limit is exceeded. Try again in "
        error_str = str(error)

        if (
            not isinstance(error, RateLimitError)
            or please_retry_after_msg not in error_str
        ):
            return 0

        # could be second or seconds
        return int(error_str.split(please_retry_after_msg)[1].split(" second")[0])
