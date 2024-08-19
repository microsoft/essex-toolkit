# Copyright (c) 2024 Microsoft Corporation.

"""TPM RPM limiter module."""

from aiolimiter import AsyncLimiter

from fnllm.limiting.base import Limiter, Manifest


class RPMLimiter(Limiter):
    """RPM limiter class definition."""

    def __init__(self, limiter: AsyncLimiter):
        """Create a new RPMLimiter."""
        self._limiter = limiter

    async def acquire(self, manifest: Manifest) -> None:
        """Acquire a new request."""
        if manifest.request_tokens > 0:
            await self._limiter.acquire()

    async def release(self, manifest: Manifest) -> None:
        """Do nothing."""

    @classmethod
    def from_rpm(
        cls, requests_per_minute: int, burst_mode: bool = True
    ) -> "RPMLimiter":
        """Create a new RPMLimiter."""
        if burst_mode:
            return cls(AsyncLimiter(requests_per_minute, time_period=60))

        return cls(AsyncLimiter(1, time_period=60 / requests_per_minute))
