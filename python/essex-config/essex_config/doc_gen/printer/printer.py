"""Printer interface."""

from abc import ABC, abstractmethod

from essex_config import Config


class ConfigurationPrinter(ABC):
    """Printer interface."""

    @abstractmethod
    def print(self, config_class: type[Config]) -> None:
        """Print the message."""
        raise NotImplementedError
