# Copyright (c) 2024 Microsoft Corporation.

"""TPM RPM limiter module."""

from aiolimiter import AsyncLimiter

from fnllm.limiting.base import Limiter, Manifest


class TPMLimiter(Limiter):
    """TPM limiter class definition."""

    def __init__(self, limiter: AsyncLimiter):
        """Create a new RpmLimiter."""
        self._limiter = limiter

    async def acquire(self, manifest: Manifest) -> None:
        """Acquire limiter permission."""
        total_tokens = manifest.request_tokens + manifest.post_request_tokens

        if total_tokens > 0:
            await self._limiter.acquire(total_tokens)

    async def release(self, manifest: Manifest) -> None:
        """Do nothing."""

    @classmethod
    def from_tpm(cls, tokens_per_minute: int) -> "TPMLimiter":
        """Create a new RpmLimiter."""
        return cls(AsyncLimiter(tokens_per_minute))
