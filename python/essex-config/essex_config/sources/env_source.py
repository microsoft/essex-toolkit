"""Environment variables source class implementation."""

import os
from typing import TypeVar

from essex_config.sources.convert_utils import convert_to_type
from essex_config.sources.source import Source

T = TypeVar("T")


class EnvSource(Source):
    """Class to get the configuration from the environment."""

    def _get_value(self, key: str, value_type: type[T]) -> T:
        """Get the value from the environment."""
        return convert_to_type(os.environ[key], value_type)

    def format_key(self, key: str, prefix: str) -> str:
        """Format the key based on the prefix."""
        return f"{prefix}_{key}".upper() if prefix.strip() != "" else key.upper()

    def __contains__(self, key: str) -> bool:
        """Check if the key is present in the environment."""
        return key in os.environ

    def __str__(self) -> str:
        """Return the string representation of the source."""
        return "EnvSource()"
