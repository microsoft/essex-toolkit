"""Essex Config utils."""

from string import Template
from typing import Any

from pydantic import BaseModel
from pydantic._internal._utils import lenient_issubclass


def is_pydantic_model(t: type) -> bool:
    """Determine if an input type is a Pydantic base model."""
    return lenient_issubclass(t, BaseModel)


def parse_string_template(value: Any, data: dict[str, Any]) -> Any:
    """Parse the string templates in str, list[str], and dict[, str]."""
    match value:
        case str():
            return Template(value).substitute(data)
        case list():
            return [parse_string_template(item, data) for item in value]
        case dict():
            return {key: parse_string_template(val, data) for key, val in value.items()}
        case _:
            return value
