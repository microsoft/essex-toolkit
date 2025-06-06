# Copyright (c) 2025 Microsoft Corporation.

"""Concurrency limiter module."""

from __future__ import annotations

from asyncio import Semaphore
from typing import TYPE_CHECKING

from .base import Limiter

if TYPE_CHECKING:
    from .types import Manifest


class ConcurrencyLimiter(Limiter):
    """Concurrency limiter class definition."""

    def __init__(self, semaphore: Semaphore):
        """Create a new ConcurrencyLimiter."""
        self._semaphore = semaphore

    async def acquire(self, manifest: Manifest) -> None:
        """Acquire a concurrency slot."""
        if manifest.request_tokens > 0:
            await self._semaphore.acquire()

    async def release(self, manifest: Manifest) -> None:
        """Release the concurrency slot."""
        if manifest.request_tokens > 0:
            self._semaphore.release()

    @classmethod
    def from_max_concurrency(cls, max_concurrency: int) -> ConcurrencyLimiter:
        """Create a new ConcurrencyLimiter."""
        return cls(Semaphore(max_concurrency))
