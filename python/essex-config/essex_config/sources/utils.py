"""Utility functions for the sources module."""

import json
import os
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
