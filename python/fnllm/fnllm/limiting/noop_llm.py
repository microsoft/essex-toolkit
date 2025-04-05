# Copyright (c) 2024 Microsoft Corporation.

"""Noop limiter module."""

from __future__ import annotations

from typing import TYPE_CHECKING

from fnllm.limiting.base import Limiter

if TYPE_CHECKING:
    from fnllm.limiting.types import Manifest


class NoopLimiter(Limiter):
    """Noop limiter class definition."""

    async def acquire(self, manifest: Manifest) -> None:
        """Do nothing."""

    async def release(self, manifest: Manifest) -> None:
        """Do nothing."""
