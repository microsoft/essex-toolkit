"""Source Abstract class definition."""

from abc import ABC, abstractmethod
from typing import Any


class Source(ABC):
    """Abstract class to define the source of the configuration."""

    @abstractmethod
    def get_data(self) -> dict[str, Any]:
        """Get the data dictionary."""
        raise NotImplementedError

    def __repr__(self) -> str:
        """Return the representation of the configuration."""
        return self.__str__()

    def __rich__(self) -> str:
        """Return the rich representation of the configuration."""
        return self.__str__()
