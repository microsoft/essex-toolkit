# Copyright (c) 2024 Microsoft Corporation.

"""Limiter Utils."""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from aiolimiter import AsyncLimiter

    from .types import LimitReconciliation


def update_limiter(
    limiter: AsyncLimiter,
    reconciliation: LimitReconciliation,
) -> float:
    """Update the limiter with the available capacity."""
    if reconciliation.limit is not None and reconciliation.limit > limiter.max_rate:
        limiter.max_rate = reconciliation.limit

    old = limiter.max_rate - limiter._level  # noqa

    if reconciliation.remaining is not None:
        new_level = max(0, limiter.max_rate - reconciliation.remaining)

        limiter._level = new_level  # noqa SLF001
        limiter._loop.call_soon(limiter._wake_next)  # noqa SLF001

    return old
