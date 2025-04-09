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
    """
    Update the limiter with the available capacity.

    This function is used to update the limiter with the available capacity.
    This method mucks with the internals of aiolimiter, which could result in instability over time if their API changes.
    There may also be concurrency scenarios and edge-cases where this will not work. Hence it should probably not be used in multithreaded environments.

    TODO(chtrevin): Implement a version of AsyncLimiter with an updateable leaky-bucket mechanism.
    """
    if reconciliation.limit is not None and reconciliation.limit > limiter.max_rate:
        limiter.max_rate = reconciliation.limit

    old = limiter.max_rate - limiter._level  # noqa

    if reconciliation.remaining is not None:
        new_level = max(0, limiter.max_rate - reconciliation.remaining)

        limiter._level = new_level  # noqa SLF001
        limiter._loop.call_soon(limiter._wake_next)  # noqa SLF001

    return old
