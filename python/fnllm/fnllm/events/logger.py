# Copyright (c) 2024 Microsoft Corporation.
# Licensed under the MIT License

"""Class for LLM event logging."""

from logging import Logger
from typing import Any

from fnllm.events.base import LLMEvents
from fnllm.limiting.base import Manifest
from fnllm.types.metrics import LLMMetrics, LLMUsageMetrics


class LLMEventsLogger(LLMEvents):
    """Implementation of the LLM events that just logs the events."""

    def __init__(self, logger: Logger) -> None:
        """Create a new LLMEventsLogger."""
        self._logger = logger

    async def on_error(
        self,
        error: BaseException | None,
        traceback: str | None = None,
        arguments: dict[str, Any] | None = None,
    ) -> None:
        """An unhandled error that happens during the LLM call (called by the LLM base)."""
        self._logger.error(
            "unexpected error occurred for arguments '%s':\n\n%s\n\n%s",
            arguments,
            error,
            traceback,
        )

    async def on_usage(self, usage: LLMUsageMetrics) -> None:
        """Called when there is any LLM usage."""
        self._logger.info(
            "LLM usage with %d total tokens (input=%d, output=%d)",
            usage.total_tokens,
            usage.input_tokens,
            usage.output_tokens,
        )

    async def on_limit_acquired(self, manifest: Manifest) -> None:
        """Called when limit is acquired for a request (does not include post limiting)."""
        self._logger.info(
            "limit acquired for request, request_tokens=%d, post_request_tokens=%d",
            manifest.request_tokens,
            manifest.post_request_tokens,
        )

    async def on_limit_released(self, manifest: Manifest) -> None:
        """Called when limit is released for a request (does not include post limiting)."""
        self._logger.info(
            "limit released for request, request_tokens=%d, post_request_tokens=%d",
            manifest.request_tokens,
            manifest.post_request_tokens,
        )

    async def on_post_limit(self, manifest: Manifest) -> None:
        """Called when post request limiting is triggered (called by the rate limiting LLM)."""
        self._logger.info(
            "post request limiting triggered, acquired extra %d tokens",
            manifest.post_request_tokens,
        )

    async def on_success(
        self,
        metrics: LLMMetrics,
    ) -> None:
        """Called when a request goes through (called by the retrying LLM)."""
        self._logger.info(
            "request succeed with %d retries in %.2fs and used %d tokens",
            metrics.retry.num_retries,
            metrics.retry.total_time,
            metrics.usage.total_tokens,
        )

    async def on_cache_hit(self, cache_key: str, name: str | None) -> None:
        """Called when there is a cache hit."""
        self._logger.info(
            "cache hit for key=%s and name=%s",
            cache_key,
            name,
        )

    async def on_cache_miss(self, cache_key: str, name: str | None) -> None:
        """Called when there is a cache miss."""
        self._logger.info(
            "cache miss for key=%s and name=%s",
            cache_key,
            name,
        )

    async def on_try(self, attempt_number: int) -> None:
        """Called every time a new try to call the LLM happens."""
        self._logger.debug("calling llm, attempt #%d", attempt_number)

    async def on_retryable_error(
        self, error: BaseException, attempt_number: int
    ) -> None:
        """Called when retryable errors happen."""
        self._logger.warning(
            "retryable error happened on attempt #%d: %s", attempt_number, str(error)
        )
