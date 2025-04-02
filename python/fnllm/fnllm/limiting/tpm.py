# Copyright (c) 2024 Microsoft Corporation.

"""TPM RPM limiter module."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from aiolimiter import AsyncLimiter

from fnllm.limiting.base import LimitContext, Limiter, Manifest
from fnllm.types.io import LLMOutput

TpmLevelReconciler = Callable[[Manifest, LLMOutput[Any, Any, Any]], int]
"""A callable that will determine the actual number of tokens left in the limiter."""


class TPMLimiter(Limiter):
    """TPM limiter class definition."""

    def __init__(
        self,
        limiter: AsyncLimiter,
        tokens_per_minute: int,
        current_level_reconciler: TpmLevelReconciler | None = None,
    ) -> None:
        """Create a new RpmLimiter."""
        self._limiter = limiter
        self._tokens_per_minute = tokens_per_minute
        self._current_level_reconciler = current_level_reconciler

    async def acquire(self, manifest: Manifest) -> None:
        """Acquire limiter permission."""
        total_tokens = manifest.request_tokens + manifest.post_request_tokens
        if total_tokens > 0:
            await self._limiter.acquire(min(total_tokens, self._tokens_per_minute))

    async def release(self, manifest: Manifest) -> None:
        """Do nothing."""

    def reconcile(
        self, manifest: Manifest, *, output: LLMOutput[Any, Any, Any]
    ) -> LimitContext:
        """Limit for a given amount (default = 1)."""
        if self._current_level_reconciler is not None:
            num_tokens_left = self._current_level_reconciler(manifest, output)
            self._limiter._level = num_tokens_left  # noqa
        return super().reconcile(manifest, output=output)

    @classmethod
    def from_tpm(cls, tokens_per_minute: int) -> TPMLimiter:
        """Create a new RpmLimiter."""
        return cls(AsyncLimiter(tokens_per_minute), tokens_per_minute)
