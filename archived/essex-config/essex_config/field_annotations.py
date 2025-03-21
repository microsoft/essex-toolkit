"""Module to define the field decorators for the configuration."""

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any, cast

from pydantic.fields import FieldInfo
from typing_extensions import TypeVar

T = TypeVar("T")


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


@dataclass
class Updatable:
    """Class to define the updatable field."""

    update: Callable[[Any, Any], Any]


def get_annotation(cls: type[T], field_info: FieldInfo) -> T:
    """Get the annotation from the field info."""
    return cast(
        T,
        next(
            (metadata for metadata in field_info.metadata if isinstance(metadata, cls)),
            None,
        ),
    )
