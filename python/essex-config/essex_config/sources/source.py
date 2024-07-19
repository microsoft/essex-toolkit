"""Source Abstract class definition."""

from abc import ABC, abstractmethod
from typing import TypeVar

T = TypeVar("T")


class Source(ABC):
    """Abstract class to define the source of the configuration."""

    @abstractmethod
    def get_value(self, key: str, value_type: type[T]) -> T:  # pragma: no cover
        """Get the value from the source."""
        raise NotImplementedError

    @abstractmethod
    def __contains__(self, key: str) -> bool:  # pragma: no cover
        """Check if the key is present in the source."""
        raise NotImplementedError

    def __repr__(self) -> str:
        """Return the representation of the configuration."""
        return self.__str__()

    def __rich__(self) -> str:
        """Return the rich representation of the configuration."""
        return self.__str__()
