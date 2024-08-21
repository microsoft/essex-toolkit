# Copyright (c) 2024 Microsoft Corporation.

"""Noop limiter module."""

from fnllm.limiting.base import Limiter, Manifest


class NoopLimiter(Limiter):
    """Noop limiter class definition."""

    async def acquire(self, manifest: Manifest) -> None:
        """Do nothing."""

    async def release(self, manifest: Manifest) -> None:
        """Do nothing."""
