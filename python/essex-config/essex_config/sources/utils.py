"""Utility functions for the sources module."""

import json
import os
from collections.abc import Callable
from pathlib import Path
from typing import TypeVar

T = TypeVar("T")


def path_from_variable(env_var_name: str) -> Path:
    """Get the path from the variable."""
    env_file_path = os.getenv(env_var_name, None)
    if env_file_path is None:
        msg = f"Environment variable {env_var_name} not found."
        raise ValueError(msg)
    return Path(env_file_path)


def json_list_parser(string: str, _: type[T]) -> list[T]:
    """Parse the JSON list."""
    return json.loads(string)


def plain_text_list_parser(delimiter: str = ",") -> Callable[[str, type[T]], list[T]]:
    """Parse the plain text list."""

    def _parser(string: str, value_type: type[T]) -> list[T]:
        try:
            subvalue_type = value_type.__args__[0]  # type: ignore
            return [subvalue_type(item) for item in string.split(delimiter)]
        except Exception as e:
            msg = f"Cannot parse plain text list for type {value_type}."
            raise ValueError(msg) from e

    return _parser
