"""Configuration Field module."""

from dataclasses import dataclass
from enum import StrEnum, auto


class FieldVisibility(StrEnum):
    """Enum to define the type of configuration."""

    DEFAULT = auto()
    SECRET = auto()


@dataclass
class ConfigurationField:
    """Model to store the configuration field."""

    field_visibility: FieldVisibility = FieldVisibility.DEFAULT
    """Type of the field."""
    alt_name: str | None = None
    """Name to look for in the config file."""
    fallback_names: list[str] | None = None
    """List of names to fallback in case alt_name is not defined."""
    description: str | None = None
    """description message for the field."""
