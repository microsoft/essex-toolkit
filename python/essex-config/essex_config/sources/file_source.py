"""File source class implementation."""

import json
import os
from collections.abc import Callable
from pathlib import Path
from typing import Any

import tomllib
import yaml

from essex_config.sources.source import Source

GET_DATA_FN: dict[str, Callable[[Any], dict[str, Any]]] = {
    ".json": json.load,
    ".toml": tomllib.load,
    ".yaml": yaml.safe_load,
    ".yml": yaml.safe_load,
}


class FileSource(Source):
    """Class to get the configuration from a file."""

    def __init__(self, file_path: Path | str, use_env_var: bool = False):
        """Initialize the class."""
        self._file_path = file_path
        self._use_env_var = use_env_var

    def get_data(self) -> dict[str, Any]:
        """Get the data dictionary."""
        file_path = self._file_path
        if self._use_env_var and isinstance(self._file_path, str):
            env_file_path = os.getenv(self._file_path, None)
            if env_file_path is None:
                msg = f"Environment variable {self._file_path} not found."
                raise ValueError(msg)
            file_path = Path(env_file_path)

        if isinstance(file_path, str):
            file_path = Path(self._file_path)

        if file_path.suffix in GET_DATA_FN:
            with file_path.open() as file:
                return GET_DATA_FN[file_path.suffix](file)
        msg = f"File type {file_path.suffix} not supported."
        raise ValueError(msg)

    def __str__(self) -> str:
        """Return the string representation of the source."""
        return f"FileSource(file_path={self._file_path})"
