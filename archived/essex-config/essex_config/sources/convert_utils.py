"""Utility functions for converting values to types."""

from ast import literal_eval
from types import UnionType
from typing import Any, Literal, TypeVar, Union, get_args, get_origin

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


def _get_value(value: Any, value_type: type[T]) -> T:
    """Get the value as the type."""
    if value_type is bool and isinstance(value, str):
        return _fix_booleans(value)  # type: ignore

    if get_origin(value_type) == Literal:
        possible_types = [type(value) for value in get_args(value_type)]
        if str in possible_types:  # Check str last to avoid conversion
            possible_types.append(possible_types.pop(possible_types.index(str)))
        return _from_literal(value, possible_types)  # type: ignore

    value = _try_literal_eval(value)
    return value_type(value)  # type: ignore


def _fix_booleans(value: str) -> bool:
    return value.strip().lower() not in ["false", "0", ""]


def _from_literal(value: Any, possible_types: tuple[type]) -> Any:
    for type_ in possible_types:
        try:
            return type_(value)
        except Exception:  # noqa: BLE001, S112
            continue
    msg = f"Cannot convert [{value}] to any of the types [{possible_types}]."
    raise ValueError(msg)


def _try_literal_eval(value: Any) -> Any:
    if isinstance(value, str):
        try:
            return literal_eval(value)
        except (ValueError, SyntaxError):
            return value
    return value
