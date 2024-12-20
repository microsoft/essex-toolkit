# Copyright (c) 2024 Microsoft Corporation.


"""Cache protocol definition."""

from __future__ import annotations

import hashlib
import json
from abc import ABC, abstractmethod
from typing import Any


class Cache(ABC):
    """Cache base class."""

    __cache_strategy_version__: int = 2
    """If there's a breaking change in what we cache, we should increment this version number to invalidate existing caches."""

    @abstractmethod
    async def has(self, key: str) -> bool:
        """Check if the cache has a value."""

    @abstractmethod
    async def get(self, key: str) -> Any | None:
        """Retrieve a value from the cache."""

    @abstractmethod
    async def remove(self, key: str) -> None:
        """Remove a value from the cache."""

    @abstractmethod
    async def clear(self) -> None:
        """Clear the cache."""

    @abstractmethod
    async def set(
        self, key: str, value: Any, metadata: dict[str, Any] | None = None
    ) -> None:
        """Write a value into the cache."""

    @abstractmethod
    def child(self, key: str) -> Cache:
        """Create a child cache."""

    def create_key(self, data: Any, *, prefix: str | None = None) -> str:
        """Create a custom key by hashing the data. Returns `{data_hash}_v{strategy_version}` or `{prefix}_{data_hash}_v{strategy_version}`."""
        data_hash = _hash(json.dumps(data, sort_keys=True))

        if prefix is not None:
            return f"{prefix}_{data_hash}_v{self.__cache_strategy_version__}"

        return f"{data_hash}_v{self.__cache_strategy_version__}"


def _hash(_input: str) -> str:
    """Use a deterministic hashing approach."""
    return hashlib.sha256(_input.encode()).hexdigest()
