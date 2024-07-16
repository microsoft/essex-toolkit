"""File source class implementation."""

import json
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

    def __init__(self, file_path: Path | str):
        """Initialize the class."""
        if isinstance(file_path, str):
            file_path = Path(file_path)
        self.file_path = file_path

    def get_data(self) -> dict[str, Any]:
        """Get the data dictionary."""
        if self.file_path.suffix in GET_DATA_FN:
            with self.file_path.open() as file:
                return GET_DATA_FN[self.file_path.suffix](file)
        msg = f"File type {self.file_path.suffix} not supported."
        raise ValueError(msg)

    def __str__(self) -> str:
        """Return the string representation of the source."""
        return f"FileSource(file_path={self.file_path})"
