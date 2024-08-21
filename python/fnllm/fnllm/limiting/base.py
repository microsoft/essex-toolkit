# Copyright (c) 2024 Microsoft Corporation.

"""Base limiter interface."""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from types import TracebackType


@dataclass
class Manifest:
    """Parameters for limiting."""

    request_tokens: int = 0
    """The number of tokens to acquire or release."""

    post_request_tokens: int = 0
    """The number of tokens to acquire or release after the request is complete."""


class LimitContext:
    """A context manager for limiting."""

    def __init__(self, limiter: "Limiter", manifest: Manifest):
        """Create a new LimitContext."""
        self._limiter = limiter
        self._manifest = manifest

    async def __aenter__(self) -> "LimitContext":
        """Enter the context."""
        await self._limiter.acquire(self._manifest)
        return self

    async def __aexit__(
        self,
        exc_type: type[BaseException] | None,
        exc_value: BaseException | None,
        traceback: TracebackType | None,
    ) -> None:
        """Exit the context."""
        await self._limiter.release(self._manifest)


class Limiter(ABC):
    """Limiter interface."""

    @abstractmethod
    async def acquire(self, manifest: Manifest) -> None:
        """Acquire a pass through the limiter."""

    @abstractmethod
    async def release(self, manifest: Manifest) -> None:
        """Release a pass through the limiter."""

    def use(self, manifest: Manifest) -> LimitContext:
        """Limit for a given amount (default = 1)."""
        return LimitContext(self, manifest)
