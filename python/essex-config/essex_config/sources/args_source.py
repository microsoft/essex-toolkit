"""Environment variables source class implementation."""

from typing import Any

from essex_config.sources.source import Source


class ArgSource(Source):
    """Class to get the configuration from the environment."""

    def __init__(self, prefix: str | None = None, **kwargs: Any):
        """Initialize the class."""
        super().__init__(prefix)
        self._args = kwargs

    def _get_value(
        self,
        key: str,
    ) -> Any:
        """Get the value from the environment."""
        return self._args[key]

    def __contains__(self, key: str) -> bool:
        """Check if the key is present in the environment."""
        return key in self._args

    def __repr__(self) -> str:
        """Return the string representation of the source."""
        return f"Argsource({self._args})"
