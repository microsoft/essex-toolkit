"""Essex Config utils."""

from pydantic import BaseModel
from pydantic._internal._utils import lenient_issubclass


def is_pydantic_model(t: type) -> bool:
    """Determine if an input type is a Pydantic base model."""
    return lenient_issubclass(t, BaseModel)
