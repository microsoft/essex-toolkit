# Copyright 2024 Microsoft Corporation.

"""Tests for utils.sliding_window"""

from datetime import datetime, timedelta, timezone
from unittest.mock import patch

from fnllm.utils import sliding_window
from fnllm.utils.sliding_window import SlidingWindow, SlidingWindowEntry


async def test_zero_sum_and_avg():
    window = SlidingWindow(1200)

    # window with zero elements should have zero average
    assert await window.sum() == 0
    assert await window.avg() == 0


async def test_sum():
    window = SlidingWindow(4)
    now = datetime.now(timezone.utc)

    # insert elements with a time diff
    with _mock_get_current_ts(now):
        await window.insert(10)

    with _mock_get_current_ts(now + timedelta(seconds=2)):
        await window.insert(20)

    # check average
    with _mock_get_current_ts(now + timedelta(seconds=3)):
        assert await window.sum() == (10 + 20)


async def test_drop_outside_window():
    window = SlidingWindow(3)
    now = datetime.now(timezone.utc)

    entry_0 = SlidingWindowEntry(ts=now, value=1)
    entry_1 = SlidingWindowEntry(ts=now + timedelta(seconds=1), value=2)
    entry_2 = SlidingWindowEntry(ts=now + timedelta(seconds=2), value=3)
    entry_3 = SlidingWindowEntry(ts=now + timedelta(seconds=3), value=4)

    # insert elements with a time diff
    with _mock_get_current_ts(entry_0.ts):
        await window.insert(entry_0.value)

    assert len(window._queue) == 1

    with _mock_get_current_ts(entry_1.ts):
        await window.insert(entry_1.value)

    assert len(window._queue) == 2

    with _mock_get_current_ts(entry_2.ts):
        await window.insert(entry_2.value)

    assert len(window._queue) == 3

    with _mock_get_current_ts(entry_3.ts):
        await window.insert(entry_3.value)

    assert len(window._queue) == 4

    # no elements should have been dropped
    current_ts = now + timedelta(seconds=3)

    with _mock_get_current_ts(current_ts):
        assert await window.sum() == (
            entry_0.value + entry_1.value + entry_2.value + entry_3.value
        )
        assert list(window._queue) == [
            entry_0,
            entry_1,
            entry_2,
            entry_3,
        ]

    # first two elements should be dropped
    current_ts = now + timedelta(seconds=5)

    with _mock_get_current_ts(current_ts):
        assert await window.sum() == (entry_2.value + entry_3.value)
        assert list(window._queue) == [
            entry_2,
            entry_3,
        ]


async def test_avg_within_same_window():
    window = SlidingWindow(3)
    now = datetime.now(timezone.utc)

    # add an elements
    with _mock_get_current_ts(now):
        await window.insert(100.0)

    with _mock_get_current_ts(now + timedelta(seconds=1)):
        await window.insert(100.0)

    # no data out of the window, should be just the sum for the first window
    with _mock_get_current_ts(now + timedelta(seconds=3)):
        assert await window.avg() == 200


async def test_avg_outside_window():
    window = SlidingWindow(3)
    now = datetime.now(timezone.utc)

    # insert elements with a time diff
    with _mock_get_current_ts(now):
        await window.insert(10)

    with _mock_get_current_ts(now + timedelta(seconds=2)):
        await window.insert(20)

    with _mock_get_current_ts(now + timedelta(seconds=4)):
        await window.insert(40)

    # check average
    with _mock_get_current_ts(now + timedelta(seconds=10)):
        assert await window.avg() == ((10 + 20 + 40) / 4) * 3


def _mock_get_current_ts(return_value: datetime):
    return patch.object(sliding_window, "get_current_ts", return_value=return_value)
