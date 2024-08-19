# Copyright (c) 2024 Microsoft Corporation.

"""Composite limiter module."""

from collections.abc import Sequence

from .base import Limiter, Manifest


class CompositeLimiter(Limiter):
    """A composite limiter that combines multiple limiters."""

    def __init__(self, limiters: Sequence[Limiter]):
        """A composite limiter that combines multiple limiters."""
        self._limiters = limiters
        self._acquire_order = limiters
        self._release_order = limiters[::-1]

    async def acquire(self, manifest: Manifest) -> None:
        """Acquire the specified amount of tokens from all limiters."""
        # this needs to be sequential, the order of the limiters must be respected
        # to avoid deadlocks
        for limiter in self._acquire_order:
            await limiter.acquire(manifest)

    async def release(self, manifest: Manifest) -> None:
        """Release all tokens from all limiters."""
        # release in the opposite order we acquired
        # the last limiter acquired should be the first one released
        for limiter in self._release_order:
            await limiter.release(manifest)
