# Copyright (c) 2024 Microsoft Corporation.

"""TPM RPM limiter module."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from aiolimiter import AsyncLimiter

from .base import Limiter
from .types import LimitUpdate
from .update_limiter import update_limiter

if TYPE_CHECKING:
    from fnllm.types.io import LLMOutput

    from .types import LimitReconciler, Manifest


class RPMLimiter(Limiter):
    """RPM limiter class definition."""

    def __init__(
        self,
        limiter: AsyncLimiter,
        reconciler: LimitReconciler | None = None,
        *,
        rps: bool,
    ) -> None:
        """Create a new RPMLimiter."""
        self._limiter = limiter
        self._reconciler = reconciler
        self._rps = rps

    async def acquire(self, manifest: Manifest) -> None:
        """Acquire a new request."""
        if manifest.request_tokens > 0:
            await self._limiter.acquire()

    async def release(self, manifest: Manifest) -> None:
        """Do nothing."""

    async def reconcile(self, output: LLMOutput[Any, Any, Any]) -> LimitUpdate | None:
        """Limit for a given amount (default = 1)."""
        if self._reconciler is not None:
            reconciliation = self._reconciler(output)
            if (
                reconciliation.limit is not None
                and reconciliation.remaining is not None
            ):
                if self._rps:
                    # If the limiter is in RPS mode, we need to convert the
                    # remaining requests to a rate.
                    reconciliation.remaining = _rpm_to_rps(reconciliation.remaining)
                    reconciliation.limit = _rpm_to_rps(reconciliation.limit)
                old = update_limiter(self._limiter, reconciliation)
                return LimitUpdate(
                    old_value=old, new_value=reconciliation.remaining or 0
                )
        return None

    @classmethod
    def from_rpm(
        cls,
        requests_per_minute: int,
        burst_mode: bool = True,
        reconciler: LimitReconciler | None = None,
    ) -> RPMLimiter:
        """Create a new RPMLimiter."""
        if burst_mode:
            return cls(
                AsyncLimiter(requests_per_minute, time_period=60),
                reconciler=reconciler,
                rps=False,
            )

        rps = _rpm_to_rps(requests_per_minute)
        return cls(
            AsyncLimiter(rps, 1),
            reconciler=reconciler,
            rps=True,
        )


def _rpm_to_rps(rpm: float) -> float:
    """Convert minutes to seconds."""
    return rpm / 60.0
