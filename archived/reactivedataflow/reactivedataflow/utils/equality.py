# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Firing Conditions."""

from collections.abc import Callable
from typing import TypeVar

T = TypeVar("T")
IsEqualCheck = Callable[[T, T], bool]


def default_is_equal(previous: T, current: T) -> bool:
    """Determine if two items are equal."""
    return previous == current
