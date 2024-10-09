"""Source Abstract class definition."""

import re
from abc import ABC, abstractmethod
from typing import Any, TypeVar

from essex_config.field_annotations import Alias, Parser
from essex_config.sources.convert_utils import convert_to_type

SourceValueType = TypeVar("SourceValueType")

SELF_REF_REGEX = r"(\$\{self\.[\w+\d*]*\})"


class Source(ABC):
    """Abstract class to define the source of the configuration."""

    def __init__(self, prefix: str | None = None):
        """Initialize the class."""
        self.prefix = prefix

    def get_value(
        self,
        key: str,
        value_type: type[SourceValueType],
        prefix: str = "",
        alias: Alias | None = None,
        parser: Parser | None = None,
    ) -> SourceValueType:
        """Get the value from the source."""
        value = None
        if alias is not None:
            for alias_key in alias.alias:
                format_key = self.format_key(
                    alias_key, prefix if alias.include_prefix else ""
                )
                if format_key in self:
                    value = self._get_value(format_key)

        format_key = self.format_key(key, prefix)
        if format_key in self and value is None:
            value = self._parse_self_reference(self._get_value(format_key), prefix)

        if value is not None:
            if parser is not None:
                try:
                    return parser.parse(value, value_type)
                except Exception as e:
                    msg = f"Error parsing the value {value} for key {key}."
                    raise ValueError(msg) from e
            return convert_to_type(value, value_type)

        msg = f"Key {key} not found in the source."
        raise KeyError(msg)

    def _populate_self_reference(self, value: str, prefix: str) -> str:
        for match in re.finditer(SELF_REF_REGEX, str(value)):
            match_str = match.group()
            config_value = match_str[7:-1]
            try:
                value = value.replace(
                    match_str,
                    self.get_value(config_value, str, prefix),
                )
            except KeyError as keyerror:
                msg = f"Value for {match.group()} is required and not found in current config source."
                raise ValueError(msg) from keyerror
        return value

    def _parse_self_reference(self, value: Any, prefix: str) -> str:
        match value:
            case str():
                return self._populate_self_reference(value, prefix)
            case list():
                return [self._populate_self_reference(item, prefix) for item in value]
            case dict():
                return {
                    key: self._populate_self_reference(val, prefix)
                    for key, val in value.items()
                }
            case _:
                return value

    @abstractmethod
    def _get_value(
        self,
        key: str,
    ) -> Any:  # pragma: no cover
        raise NotImplementedError

    def format_key(self, key: str, prefix: str) -> str:
        """Format the key based on the prefix."""
        return f"{prefix}.{key}" if prefix.strip() != "" else key

    @abstractmethod
    def __contains__(self, key: str) -> bool:  # pragma: no cover
        """Check if the key is present in the source."""
        raise NotImplementedError

    def __str__(self) -> str:  # pragma: no cover
        """Return the representation of the configuration."""
        return self.__repr__()

    def __rich__(self) -> str:  # pragma: no cover
        """Return the rich representation of the configuration."""
        return self.__repr__()
