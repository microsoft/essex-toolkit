"""Utility functions for converting values to types."""

from types import UnionType
from typing import Any, TypeVar, Union, get_args, get_origin

T = TypeVar("T")


def convert_to_type(value: Any, value_type: type[T]) -> T:
    """Convert the value to the type."""
    origin = get_origin(value_type)
    if origin is Union or origin is UnionType:
        types = get_args(value_type)
        for type_ in types:
            try:
                return type_(value)  # type: ignore
            except Exception:  # noqa: S112, BLE001
                continue
        msg = f"Cannot convert [{value}] to any of the types [{types}]."
        raise ValueError(msg)
    try:
        return value_type(value)  # type: ignore
    except Exception as e:
        msg = f"Cannot convert [{value}] to type [{value_type}]."
        raise ValueError(msg) from e
