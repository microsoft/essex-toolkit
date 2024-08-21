# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation for OpenAI."""

import asyncio
from typing import Final, Generic

from openai import APIConnectionError, InternalServerError, RateLimitError

from fnllm.events.base import LLMEvents
from fnllm.services.retryer import Retryer
from fnllm.types.generics import THistoryEntry, TInput, TModelParameters, TOutput

OPENAI_RETRYABLE_ERRORS: Final[list[type[Exception]]] = [
    RateLimitError,
    APIConnectionError,
    InternalServerError,
]


class OpenAIRetryer(
    Retryer[TInput, TOutput, THistoryEntry, TModelParameters],
    Generic[TInput, TOutput, THistoryEntry, TModelParameters],
):
    """A base class to rate limit the LLM."""

    def __init__(
        self,
        *,
        tag: str = "OpenAIRetryingLLM",
        max_retries: int = 10,
        max_retry_wait: float = 10,
        sleep_on_rate_limit_recommendation: bool = False,
        events: LLMEvents | None = None,
    ):
        """Create a new BaseRateLimitLLM."""
        super().__init__(
            retryable_errors=OPENAI_RETRYABLE_ERRORS,
            tag=tag,
            max_retries=max_retries,
            max_retry_wait=max_retry_wait,
            events=events,
        )
        self._sleep_on_rate_limit_recommendation = sleep_on_rate_limit_recommendation

    async def _on_retryable_error(self, error: BaseException) -> None:
        sleep_recommendation = self._extract_sleep_recommendation(error)
        if sleep_recommendation > 0:
            await asyncio.sleep(sleep_recommendation)

    def _extract_sleep_recommendation(self, error: BaseException) -> float:
        """Extract the sleep time value from a RateLimitError. This is usually only available in Azure."""
        please_retry_after_msg: Final = "Rate limit is exceeded. Try again in "

        if not self._sleep_on_rate_limit_recommendation:
            return 0

        error_str = str(error)

        if (
            not isinstance(error, RateLimitError)
            or please_retry_after_msg not in error_str
        ):
            return 0

        # could be second or seconds
        return int(error_str.split(please_retry_after_msg)[1].split(" second")[0])
