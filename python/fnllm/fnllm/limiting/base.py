# Copyright (c) 2024 Microsoft Corporation.

"""Base limiter interface."""

from __future__ import annotations

from abc import ABC, abstractmethod
from asyncio import Semaphore
from dataclasses import dataclass
from typing import TYPE_CHECKING, Any, ClassVar

if TYPE_CHECKING:
    from types import TracebackType

    from fnllm.types.io import LLMOutput


@dataclass
class Manifest:
    """Parameters for limiting."""

    request_tokens: int = 0
    """The number of tokens to acquire or release."""

    post_request_tokens: int = 0
    """The number of tokens to acquire or release after the request is complete."""


class LimitContext:
    """A context manager for limiting."""

    acquire_semaphore: ClassVar[Semaphore] = Semaphore()

    def __init__(self, limiter: Limiter, manifest: Manifest):
        """Create a new LimitContext."""
        self._limiter = limiter
        self._manifest = manifest

    async def __aenter__(self) -> LimitContext:  # noqa: PYI034 - Self requires python 3.11+
        """Enter the context."""
        async with LimitContext.acquire_semaphore:
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


@dataclass
class Reconciliation:
    """A limit reconciliation."""

    old_value: float
    """The old limit value."""

    new_value: float
    """The new limit value."""


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

    async def reconcile(  # noqa B027
        self, output: LLMOutput[Any, Any, Any]
    ) -> Reconciliation | None:
        """Limit for a given amount (default = 1)."""
