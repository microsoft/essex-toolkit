# Copyright (c) 2024 Microsoft Corporation.
# Licensed under the MIT License

"""Class for LLM event usage tracking."""

from __future__ import annotations

from typing import TYPE_CHECKING

from fnllm.events.base import LLMEvents
from fnllm.types.metrics import LLMUsageMetrics
from fnllm.utils.sliding_window import SlidingWindow

if TYPE_CHECKING:
    from fnllm.limiting.base import Manifest


class LLMUsageTracker(LLMEvents):
    """Implementation of the LLM events to track usage information."""

    def __init__(
        self,
        rpm_sliding_window: SlidingWindow,
        tpm_sliding_window: SlidingWindow,
    ) -> None:
        """Create a new LLMUsageTracker."""
        self._rpm_sliding_window = rpm_sliding_window
        self._tpm_sliding_window = tpm_sliding_window
        self._current_concurrency = 0
        self._max_concurrency = 0
        self._total_usage = LLMUsageMetrics()
        self._total_requests = 0

    @property
    def total_usage(self) -> LLMUsageMetrics:
        """Total usage so far."""
        return self._total_usage.model_copy()

    @property
    def total_requests(self) -> int:
        """Total number of requests made."""
        return self._total_requests

    @property
    def current_concurrency(self) -> int:
        """Current effective concurrency."""
        return self._current_concurrency

    @property
    def max_concurrency(self) -> int:
        """Maximum registered concurrency."""
        return self._max_concurrency

    async def current_rpm(self) -> float:
        """Returns the current RPM for `[now - time_window, now]`."""
        return await self._rpm_sliding_window.sum()

    async def avg_rpm(self) -> float:
        """Return the total average RPM since the beginning."""
        return await self._rpm_sliding_window.avg()

    async def current_tpm(self) -> float:
        """Returns the current TPM from `[now - time_window, now]`."""
        return await self._tpm_sliding_window.sum()

    async def avg_tpm(self) -> float:
        """Return the total average TPM since the beginning."""
        return await self._tpm_sliding_window.avg()

    async def on_usage(self, usage: LLMUsageMetrics) -> None:
        """Called when there is any LLM usage."""
        self._total_requests += 1
        self._total_usage.input_tokens += usage.input_tokens
        self._total_usage.output_tokens += usage.output_tokens

    async def on_limit_acquired(self, manifest: Manifest) -> None:
        """Called when limit is acquired for a request (does not include post limiting)."""
        self._current_concurrency += 1
        self._max_concurrency = max(self._max_concurrency, self._current_concurrency)

        await self._rpm_sliding_window.insert(1)
        await self._tpm_sliding_window.insert(manifest.request_tokens)

    async def on_limit_released(self, manifest: Manifest) -> None:
        """Called when limit is released for a request (does not include post limiting)."""
        self._current_concurrency = max(0, self._current_concurrency - 1)

    async def on_post_limit(self, manifest: Manifest) -> None:
        """Called when post request limiting is triggered (called by the rate limiting LLM)."""
        await self._tpm_sliding_window.insert(manifest.post_request_tokens)

    @classmethod
    def create(cls) -> LLMUsageTracker:
        """Create a new LLMUsageTracker with proper sliding windows."""
        return cls(SlidingWindow(60), SlidingWindow(60))
