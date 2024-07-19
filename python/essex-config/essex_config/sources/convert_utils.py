"""Utility functions for converting values to types."""

from typing import Any, TypeVar

T = TypeVar("T")


def convert_to_type(value: Any, value_type: type[T]) -> T:
    """Convert the value to the type."""
    try:
        return value_type(value)  # type: ignore
    except Exception as e:
        msg = f"Cannot convert [{value}] to type [{value_type}]."
        raise ValueError(msg) from e
