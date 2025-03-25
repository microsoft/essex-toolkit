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

    def __init__(self, max_age_seconds: int, factory: Callable[..., V]):
        self.data = defaultdict(factory)
        self.timestamps = defaultdict(lambda: None)
        self.max_age_seconds = max_age_seconds
        self.eviction_queue = deque()

    def __setitem__(self, key, value):
        """Set an item in the dictionary and update its timestamp."""
        current_time = time.time()
        self.data[key] = value
        self.timestamps[key] = current_time
        self.eviction_queue.append((key, current_time))
        self.evict_old_items()

    def __getitem__(self, key):
        """Get an item from the dictionary and update its timestamp."""
        self.evict_old_items()
        return self.data[key]

    def evict_old_items(self):
        """Evict items that are older than the max age."""
        current_time = time.time()
        while self.eviction_queue:
            key, timestamp = self.eviction_queue[0]
            if current_time - timestamp > self.max_age_seconds:
                self.eviction_queue.popleft()
                if self.timestamps[key] == timestamp:
                    del self.data[key]
                    del self.timestamps[key]
            else:
                break
