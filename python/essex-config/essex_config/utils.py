"""Utility functions for the essex_config package."""

from string import Template
from typing import Any


def parse_string_template(value: Any, data: dict[str, Any]) -> Any:
    """Parse the string templates in str, list[str], and dict[, str]."""
    if isinstance(value, str):
        return Template(value).substitute(data)
    if isinstance(value, list):
        return [parse_string_template(item, data) for item in value]
    if isinstance(value, dict):
        return {key: parse_string_template(val, data) for key, val in value.items()}

    return value
