"""Source Abstract class definition."""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TypeVar

T = TypeVar("T")


@dataclass
class Alias:
    """Class to define the alias for the source."""

    source: type["Source"]
    alias: list[str]


class Source(ABC):
    """Abstract class to define the source of the configuration."""

    def get_value(
        self,
        key: str,
        value_type: type[T],
        prefix: str = "",
        alias: Alias | None = None,
    ) -> T:
        """Get the value from the source."""
        format_key = self.format_key(key, prefix)
        if alias is not None:
            for alias_key in alias.alias:
                format_key = self.format_key(alias_key, prefix)
                if format_key in self:
                    return self._get_value(format_key, value_type)
        if format_key in self:
            return self._get_value(format_key, value_type)

        msg = f"Key {key} not found in the source."
        raise KeyError(msg)

    @abstractmethod
    def _get_value(self, key: str, value_type: type[T]) -> T:  # pragma: no cover
        raise NotImplementedError

    def format_key(self, key: str, prefix: str) -> str:
        """Format the key based on the prefix."""
        return f"{prefix}.{key}" if prefix.strip() != "" else key

    @abstractmethod
    def __contains__(self, key: str) -> bool:  # pragma: no cover
        """Check if the key is present in the source."""
        raise NotImplementedError

    def __repr__(self) -> str:  # pragma: no cover
        """Return the representation of the configuration."""
        return self.__str__()

    def __rich__(self) -> str:  # pragma: no cover
        """Return the rich representation of the configuration."""
        return self.__str__()
