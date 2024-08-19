# Copyright (c) 2024 Microsoft Corporation.

"""Concurrency limiter module."""

from asyncio import Semaphore

from fnllm.limiting.base import Limiter, Manifest


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
    def from_max_concurrency(cls, max_concurrency: int) -> "ConcurrencyLimiter":
        """Create a new ConcurrencyLimiter."""
        return cls(Semaphore(max_concurrency))
