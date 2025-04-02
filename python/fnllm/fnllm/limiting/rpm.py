# Copyright (c) 2024 Microsoft Corporation.

"""TPM RPM limiter module."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from aiolimiter import AsyncLimiter

from fnllm.limiting.base import Limiter, Manifest, Reconciliation
from fnllm.types.io import LLMOutput

RpmReconciler = Callable[[Manifest, LLMOutput[Any, Any, Any]], int | None]
"""A callable that will determine the actual number of requests left in the limiter."""


class RPMLimiter(Limiter):
    """RPM limiter class definition."""

    def __init__(
        self, limiter: AsyncLimiter, reconciler: RpmReconciler | None = None
    ) -> None:
        """Create a new RPMLimiter."""
        self._limiter = limiter
        self._reconciler = reconciler

    async def acquire(self, manifest: Manifest) -> None:
        """Acquire a new request."""
        if manifest.request_tokens > 0:
            await self._limiter.acquire()

    async def release(self, manifest: Manifest) -> None:
        """Do nothing."""

    async def reconcile(
        self, manifest: Manifest, *, output: LLMOutput[Any, Any, Any]
    ) -> Reconciliation | None:
        """Limit for a given amount (default = 1)."""
        if self._reconciler is not None:
            remaining = self._reconciler(manifest, output)
            if remaining is not None:
                old = self._limiter._level  # noqa
                self._limiter._level = remaining  # noqa
                return Reconciliation(old_value=old, new_value=remaining)

        return None

    @classmethod
    def from_rpm(
        cls,
        requests_per_minute: int,
        burst_mode: bool = True,
        reconciler: RpmReconciler | None = None,
    ) -> RPMLimiter:
        """Create a new RPMLimiter."""
        if burst_mode:
            return cls(AsyncLimiter(requests_per_minute, time_period=60), reconciler)

        return cls(AsyncLimiter(1, time_period=60 / requests_per_minute), reconciler)
