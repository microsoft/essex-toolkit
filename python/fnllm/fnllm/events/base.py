# Copyright (c) 2024 Microsoft Corporation.
# Licensed under the MIT License

"""Base class for LLM event handling."""

from typing import Any

from fnllm.limiting.base import Manifest
from fnllm.types.metrics import LLMMetrics, LLMUsageMetrics


class LLMEvents:
    """Base LLM events handler to be implemented by the user."""

    async def on_execute_llm(
        self,
    ) -> None:
        """Hook called before the actual LLM call."""

    async def on_error(
        self,
        error: BaseException | None,
        traceback: str | None = None,
        arguments: dict[str, Any] | None = None,
    ) -> None:
        """An unhandled error that happens during the LLM call (called by the LLM base)."""

    async def on_usage(self, usage: LLMUsageMetrics) -> None:
        """Called when there is any LLM usage."""

    async def on_limit_acquired(self, manifest: Manifest) -> None:
        """Called when limit is acquired for a request (does not include post limiting)."""

    async def on_limit_released(self, manifest: Manifest) -> None:
        """Called when limit is released for a request (does not include post limiting)."""

    async def on_post_limit(self, manifest: Manifest) -> None:
        """Called when post request limiting is triggered (called by the rate limiting LLM)."""

    async def on_success(
        self,
        metrics: LLMMetrics,
    ) -> None:
        """Called when a request goes through (called by the retrying LLM)."""

    async def on_cache_hit(self, cache_key: str, name: str | None) -> None:
        """Called when there is a cache hit."""

    async def on_cache_miss(self, cache_key: str, name: str | None) -> None:
        """Called when there is a cache miss."""

    async def on_try(self, attempt_number: int) -> None:
        """Called every time a new try to call the LLM happens."""

    async def on_retryable_error(
        self, error: BaseException, attempt_number: int
    ) -> None:
        """Called when retryable errors happen."""
