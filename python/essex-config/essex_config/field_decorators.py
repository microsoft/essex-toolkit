"""Module to define the field decorators for the configuration."""

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any


@dataclass
class Alias:
    """Class to define the alias for the source."""

    source: type
    alias: list[str]
    include_prefix: bool = False


@dataclass
class Prefixed:
    """Class to define the prefix for the configuration."""

    prefix: str


@dataclass
class Parser:
    """Class to define the parser for the configuration."""

    parse: Callable[[Any, type], Any]
