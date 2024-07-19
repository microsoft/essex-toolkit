"""Environment variables source class implementation."""

import os
from typing import TypeVar

from essex_config.sources.convert_utils import convert_to_type
from essex_config.sources.source import Source

T = TypeVar("T")


class EnvSource(Source):
    """Class to get the configuration from the environment."""

    def get_value(self, key: str, value_type: type[T]) -> T:
        """Get the value from the environment."""
        value = os.getenv(key)
        if value is None:
            msg = f"Key {key} not found in the environment."
            raise KeyError(msg)
        return convert_to_type(value, value_type)

    def __contains__(self, key: str) -> bool:
        """Check if the key is present in the environment."""
        return key in os.environ

    def __str__(self) -> str:
        """Return the string representation of the source."""
        return "EnvSource()"
