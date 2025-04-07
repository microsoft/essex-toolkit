"""Printer interface."""

from abc import ABC, abstractmethod

from pydantic import BaseModel


class ConfigurationPrinter(ABC):
    """Printer interface."""

    @abstractmethod
    def print(
        self, config_class: type[BaseModel], disable_nested: bool
    ) -> None:  # pragma: no cover
        """Print the message."""
        raise NotImplementedError
