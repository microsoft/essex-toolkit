# Copyright (c) 2024 Microsoft Corporation.

"""Implementation of a sliding window based on time to calculate a moving average."""

# Copyright (c) 2024 Microsoft Corporation.

from asyncio import Lock
from collections import deque
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone


def get_current_ts() -> datetime:
    """Current timestamp."""
    return datetime.now(timezone.utc)


@dataclass
class SlidingWindowEntry:
    """Represents an entry on the sliding window."""

    ts: datetime
    """Entry timestamp."""

    value: float
    """Entry value."""


# TODO: move this implementation to numpy for better performance
class SlidingWindow:
    """Sliding window implementation. This tracks values for a given time `time_window`, always starting from the current time."""

    def __init__(self, time_window: int):
        """Create a new sliding window with a given `time_window` in seconds.

        For example, if `time_window = 120`, it will keep values for two minutes from when they are inserted.
        """
        self._mutex = Lock()
        self._queue = deque[SlidingWindowEntry]()
        self._time_window = timedelta(seconds=time_window)
        self._time_windows_secs = time_window
        self._total = 0.0
        self._first_insertion_ts: datetime | None = None
        self._last_insertion_ts: datetime | None = None

    def _track_total(self, value: float) -> datetime:
        now = get_current_ts()

        if not self._first_insertion_ts:
            self._first_insertion_ts = now

        self._last_insertion_ts = now
        self._total += value

        return now

    def _remove_outside_window(self, now: datetime):
        while len(self._queue) > 0 and self._queue[0].ts + self._time_window < now:
            # timestamp at the front is outside the window, remove
            self._queue.popleft()

    async def insert(self, value: float) -> None:
        """Insert a new value into window, the timestamp will be the insertion time."""
        async with self._mutex:
            now = self._track_total(value)
            self._queue.append(SlidingWindowEntry(now, value))
            self._remove_outside_window(now)

    async def sum(self) -> float:
        """Get the sum of all values still in the window."""
        async with self._mutex:
            self._remove_outside_window(get_current_ts())
            return sum(entry.value for entry in self._queue)

    async def avg(self) -> float:
        """Average per time window of all the values that have ever been inserted in the window (including the ones already outside it).

        `result = [sum(all values) / (last_insertion_ts - first_insertion_ts)] * time_window`
        """
        async with self._mutex:
            if (
                not self._first_insertion_ts
                or not self._last_insertion_ts
                or self._last_insertion_ts == self._first_insertion_ts
            ):
                return self._total

            diff = (self._last_insertion_ts - self._first_insertion_ts).total_seconds()

            # keep accumulating until enough time has passed
            if diff < self._time_windows_secs:
                return self._total

            return self._total * self._time_windows_secs / diff
