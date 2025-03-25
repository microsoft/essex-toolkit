# Copyright (c) 2024 Microsoft Corporation.

"""Cached LLM Implementation."""

from __future__ import annotations

import time
from collections import defaultdict, deque
from typing import TYPE_CHECKING, Generic, TypeVar

if TYPE_CHECKING:
    from collections.abc import Callable
K = TypeVar("K")
V = TypeVar("V")


class AgeBasedEvictionDict(Generic[K, V]):
    """A dictionary that evicts items based on their age."""

    _data: dict[K, V]
    _timestamps: dict[K, float]

    def __init__(self, max_age_seconds: int, value_factory: Callable[..., V]):
        self._data = defaultdict(value_factory)
        self._timestamps = {}
        self._eviction_queue = deque()
        self.max_age_seconds = max_age_seconds

    def __setitem__(self, key: K, value: V) -> None:
        """Set an item in the dictionary and update its timestamp."""
        current_time = time.time()
        self._data[key] = value
        self._timestamps[key] = current_time
        self._eviction_queue.append((key, current_time))
        self._evict_old_items()

    def __getitem__(self, key: K) -> V:
        """Get an item from the dictionary and update its timestamp."""
        self._evict_old_items()
        return self._data[key]

    def _evict_old_items(self):
        """Evict items that are older than the max age."""
        current_time = time.time()
        while self._eviction_queue:
            key, timestamp = self._eviction_queue[0]
            if current_time - timestamp > self.max_age_seconds:
                self._eviction_queue.popleft()
                if self._timestamps[key] == timestamp:
                    del self._data[key]
                    del self._timestamps[key]
            else:
                break
