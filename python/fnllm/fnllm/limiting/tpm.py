# Copyright (c) 2024 Microsoft Corporation.

"""TPM RPM limiter module."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from aiolimiter import AsyncLimiter

from fnllm.limiting.base import Limiter, Manifest, Reconciliation
from fnllm.types.io import LLMOutput

from .update_limiter import update_limiter

TpmReconciler = Callable[[Manifest, LLMOutput[Any, Any, Any]], int | None]
"""A callable that will determine the actual number of tokens left in the limiter."""


class TPMLimiter(Limiter):
    """TPM limiter class definition."""

    def __init__(
        self,
        limiter: AsyncLimiter,
        tokens_per_minute: int,
        reconciler: TpmReconciler | None = None,
    ) -> None:
        """Create a new RpmLimiter."""
        self._limiter = limiter
        self._tokens_per_minute = tokens_per_minute
        self._reconciler = reconciler

    async def acquire(self, manifest: Manifest) -> None:
        """Acquire limiter permission."""
        total_tokens = manifest.request_tokens + manifest.post_request_tokens
        if total_tokens > 0:
            await self._limiter.acquire(min(total_tokens, self._tokens_per_minute))

    async def release(self, manifest: Manifest) -> None:
        """Do nothing."""

    async def reconcile(
        self, manifest: Manifest, *, output: LLMOutput[Any, Any, Any]
    ) -> Reconciliation | None:
        """Limit for a given amount (default = 1)."""
        if self._reconciler is not None:
            remaining = self._reconciler(manifest, output)
            if remaining is not None:
                old = update_limiter(self._limiter, remaining)
                return Reconciliation(old_value=old, new_value=remaining)

        return None

    @classmethod
    def from_tpm(
        cls, tokens_per_minute: int, *, reconciler: TpmReconciler | None = None
    ) -> TPMLimiter:
        """Create a new RpmLimiter."""
        return cls(
            AsyncLimiter(tokens_per_minute), tokens_per_minute, reconciler=reconciler
        )
