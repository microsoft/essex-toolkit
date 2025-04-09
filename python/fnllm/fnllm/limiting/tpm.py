# Copyright (c) 2024 Microsoft Corporation.

"""TPM RPM limiter module."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from aiolimiter import AsyncLimiter

from fnllm.limiting.base import Limiter

from .types import LimitReconciler, LimitUpdate
from .update_limiter import update_limiter

if TYPE_CHECKING:
    from fnllm.types.io import LLMOutput

    from .types import LimitReconciler, Manifest


class TPMLimiter(Limiter):
    """TPM limiter class definition."""

    def __init__(
        self,
        limiter: AsyncLimiter,
        tokens_per_minute: int,
        reconciler: LimitReconciler | None = None,
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

    async def reconcile(self, output: LLMOutput[Any, Any, Any]) -> LimitUpdate | None:
        """Limit for a given amount (default = 1)."""
        if self._reconciler is not None:
            reconciliation = self._reconciler(output)
            old = update_limiter(self._limiter, reconciliation)
            return LimitUpdate(old_value=old, new_value=reconciliation.remaining or 0)

        return None

    @classmethod
    def from_tpm(
        cls,
        tokens_per_minute: int,
        *,
        reconciler: LimitReconciler | None = None,
    ) -> TPMLimiter:
        """Create a new RpmLimiter."""
        return cls(
            AsyncLimiter(tokens_per_minute),
            tokens_per_minute,
            reconciler=reconciler,
        )
