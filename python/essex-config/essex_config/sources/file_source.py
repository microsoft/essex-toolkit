"""File source class implementation."""

import json
from collections.abc import Callable
from functools import cache
from pathlib import Path
from typing import Any

import tomllib
import yaml

from essex_config.sources.source import Source
from essex_config.sources.utils import path_from_variable

GET_DATA_FN: dict[str, Callable[[Any], dict[str, Any]]] = {
    ".json": json.load,
    ".toml": tomllib.load,
    ".yaml": yaml.safe_load,
    ".yml": yaml.safe_load,
}


class FileSource(Source):
    """Class to get the configuration from a file."""

    def __init__(
        self,
        file_path: Path | str,
        use_env_var: bool = False,
        silence_file_error: bool = False,
    ):
        """Initialize the class."""
        self._file_path = file_path
        self._use_env_var = use_env_var
        self._silence_file_error = silence_file_error

    @staticmethod
    @cache
    def __get_data(
        file_path: str | Path, use_env_var: bool, silence_file_error: bool
    ) -> dict[str, Any]:
        """Get the data dictionary."""
        if use_env_var and isinstance(file_path, str):
            file_path = path_from_variable(file_path)

        if isinstance(file_path, str):
            file_path = Path(file_path)

        if file_path.suffix in GET_DATA_FN:
            try:
                with file_path.open() as file:
                    return GET_DATA_FN[file_path.suffix](file)
            except FileNotFoundError:
                if silence_file_error:
                    return {}
                raise

        msg = f"File type {file_path.suffix} not supported."
        raise ValueError(msg)

    def _get_value(
        self,
        key: str,
    ) -> Any:
        """Get the value from the file."""
        data = FileSource.__get_data(
            self._file_path, self._use_env_var, self._silence_file_error
        )

        if "." in key:
            parts = key.split(".")
            value = data
            for part in parts:
                value = value[part]
            return value

        return data[key]

    def __contains__(self, key: str) -> bool:
        """Check if the key is present in the file."""
        data = FileSource.__get_data(
            self._file_path, self._use_env_var, self._silence_file_error
        )

        if "." in key:
            parts = key.split(".")
            value = data
            try:
                for part in parts:
                    value = value[part]
            except KeyError:
                return False
            return True

        return key in data

    def __repr__(self) -> str:
        """Return the string representation of the source."""
        return f"FileSource(file_path={self._file_path})"
