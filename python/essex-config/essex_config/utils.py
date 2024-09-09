"""Utility functions for the essex_config package."""

from string import Template
from typing import Any


def parse_string_template(value: Any, data: dict[str, Any]) -> Any:
    """Parse the string templates in str, list[str], and dict[, str]."""
    value_type: type = type(value)
    match value_type.__name__:
        case "str":
            return Template(value).substitute(data)
        case "list":
            return [parse_string_template(item, data) for item in value]
        case "dict":
            return {key: parse_string_template(val, data) for key, val in value.items()}
        case _:
            return value
