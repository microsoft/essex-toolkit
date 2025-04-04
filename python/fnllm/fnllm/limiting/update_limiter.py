# Copyright (c) 2024 Microsoft Corporation.

"""Limiter Utils."""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from aiolimiter import AsyncLimiter


def update_limiter(
    limiter: AsyncLimiter,
    available: float,
) -> float:
    """Update the limiter with the available capacity."""
    if available > limiter.max_rate:
        limiter.max_rate = available

    old = limiter.max_rate - limiter._level  # noqa
    new_level = limiter.max_rate - available
    if new_level < 0:
        new_level = 0

    limiter._level = new_level  # noqa SLF001
    limiter._loop.call_soon(limiter._wake_next)  # noqa SLF001
    return old
