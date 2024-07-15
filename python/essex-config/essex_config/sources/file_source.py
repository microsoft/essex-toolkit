"""File source class implementation."""

import json
from pathlib import Path
from typing import Any

import tomllib

from essex_config.sources.source import Source


class FileSource(Source):
    """Class to get the configuration from a file."""

    def __init__(self, file_path: Path | str):
        """Initialize the class."""
        if isinstance(file_path, str):
            file_path = Path(file_path)
        self.file_path = file_path

    def get_data(self) -> dict[str, Any]:
        """Get the data dictionary."""
        if self.file_path.suffix == ".json":
            with self.file_path.open() as file:
                return json.load(file)
        elif self.file_path.suffix == ".toml":
            with self.file_path.open("rb") as file:
                return tomllib.load(file)
        msg = f"File type {self.file_path.suffix} not supported."
        raise ValueError(msg)

    def __str__(self) -> str:
        """Return the string representation of the source."""
        return f"FileSource(file_path={self.file_path})"
