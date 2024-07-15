"""Environment variables source class implementation."""

import os
from typing import Any

from essex_config.sources.source import Source


class EnvSource(Source):
    """Class to get the configuration from the environment."""

    def get_data(self) -> dict[str, Any]:
        """Get the data dictionary."""
        return {**os.environ}

    def __str__(self) -> str:
        """Return the string representation of the source."""
        return "EnvSource()"
