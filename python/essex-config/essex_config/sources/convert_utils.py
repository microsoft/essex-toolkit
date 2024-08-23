"""Utility functions for converting values to types."""

from ast import literal_eval
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
                value = _try_literal_eval(value)
                return type_(value)  # type: ignore
            except Exception:  # noqa: S112, BLE001
                continue
        msg = f"Cannot convert [{value}] to any of the types [{types}]."
        raise ValueError(msg)
    try:
        return _get_value(value, value_type)  # type: ignore
    except Exception as e:
        msg = f"Cannot convert [{value}] to type [{value_type}]."
        raise ValueError(msg) from e
    


def _get_value(value: str, value_type: type[T]) -> T:
    """Get the value as the type."""
    if value_type is bool:
        return _fix_booleans(value)
    value = _try_literal_eval(value)
    return value_type(value)

def _fix_booleans(value: str) -> str:
    if value.strip().lower() == "true":
        return True
    if value.strip().lower() == "false":
        return False
    return value

def _try_literal_eval(value: str) -> Any:
    try:
        return literal_eval(value)
    except (ValueError, SyntaxError):
        return value