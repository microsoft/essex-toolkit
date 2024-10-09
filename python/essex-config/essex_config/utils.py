"""Essex Config utils."""

from string import Template
from typing import Any

from pydantic import BaseModel
from pydantic._internal._utils import lenient_issubclass


def is_pydantic_model(t: type) -> bool:
    """Determine if an input type is a Pydantic base model."""
    return lenient_issubclass(t, BaseModel)


def _populate_string_template(value: str, data: dict[str, Any]) -> str:
    return Template(value).substitute(data)


def parse_string_template(value: Any, data: dict[str, Any]) -> Any:
    """Parse the string templates in str, list[str], and dict[, str]."""
    match value:
        case str():
            return _populate_string_template(value, data)
        case list():
            return [_populate_string_template(item, data) for item in value]
        case dict():
            return {
                key: _populate_string_template(val, data) for key, val in value.items()
            }
        case _:
            return value
