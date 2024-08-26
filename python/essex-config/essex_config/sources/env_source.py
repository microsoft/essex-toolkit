"""Environment variables source class implementation."""

import os
from functools import cache
from pathlib import Path
from typing import Any

from dotenv import dotenv_values

from essex_config.sources.source import Source
from essex_config.sources.utils import path_from_variable


class EnvSource(Source):
    """Class to get the configuration from the environment."""

    def __init__(
        self,
        file_path: Path | str | None = None,
        use_env_var: bool = False,
        required: bool = False,
        prefix: str | None = None,
    ):
        """Initialize the class."""
        super().__init__(prefix)
        self._file_path = file_path
        self._use_env_var = use_env_var
        self._required = required

    @staticmethod
    @cache
    def __get_data(
        file_path: str | Path, use_env_var: bool, required: bool
    ) -> dict[str, Any]:
        """Get the data dictionary."""
        if use_env_var and isinstance(file_path, str):
            file_path = path_from_variable(file_path)

        if isinstance(file_path, str):
            file_path = Path(file_path)

        if file_path.exists():
            return dotenv_values(file_path)

        if required:
            msg = f"File {file_path} not found."
            raise FileNotFoundError(msg)
        return {}

    def _get_value(
        self,
        key: str,
    ) -> Any:
        """Get the value from the environment."""
        if self._file_path is not None:
            extra_data = EnvSource.__get_data(
                self._file_path, self._use_env_var, self._required
            )
            if key in extra_data:
                return extra_data[key]
        return os.getenv(key)

    def format_key(self, key: str, prefix: str) -> str:
        """Format the key based on the prefix."""
        result = f"{prefix}_{key}".upper() if prefix.strip() != "" else key.upper()
        return result.replace(".", "_")

    def __contains__(self, key: str) -> bool:
        """Check if the key is present in the environment."""
        if self._file_path is not None:
            extra_data = EnvSource.__get_data(
                self._file_path, self._use_env_var, self._required
            )
            if key in extra_data:
                return True
        return key in os.environ

    def __repr__(self) -> str:
        """Return the string representation of the source."""
        return "EnvSource()"
