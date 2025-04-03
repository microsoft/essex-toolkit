# Copyright (c) 2024 Microsoft Corporation.

"""Limiter Utils."""

from __future__ import annotations

from typing import TYPE_CHECKING

from fnllm.events.logger import LOGGER

if TYPE_CHECKING:
    from aiolimiter import AsyncLimiter


def update_limiter(
    limiter: AsyncLimiter,
    available: int,
) -> float:
    """Update the limiter with the available capacity."""
    if available > limiter.max_rate:
        LOGGER.info("Bumping limiter max_rate to %s", available)
        limiter.max_rate = available

    old = limiter.max_rate - limiter._level  # noqa
    new_level = limiter.max_rate - available
    if new_level < 0:
        new_level = 0
    limiter._level = new_level  # noqa
    limiter._wake_next()  # noqa

    LOGGER.debug("Reconciled limiter from %s to %s", old, available)
    return old
