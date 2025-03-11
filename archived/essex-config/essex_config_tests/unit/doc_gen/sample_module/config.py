"""Example configuration object."""

from typing import Annotated

from essex_config.config import Prefixed
from essex_config.sources.env_source import EnvSource
from essex_config.sources.file_source import FileSource
from essex_config.sources.source import Alias
from pydantic import BaseModel, Field


class NestedConfiguration(BaseModel):
    """Nested configuration class for the project."""

    a_nested_string: str = Field(..., description="A nested string.")
    a_nested_int: Annotated[
        int, Alias(FileSource, ["int"]), Alias(EnvSource, ["INTEGER"])
    ] = Field(..., description="A nested integer.")
    prefixed_test: Annotated[float, Prefixed("test")] = Field(
        default=3.14, description="A prefixed float."
    )


class MainConfiguration(BaseModel):
    """Main configuration class for the project.

    Documentation generation supports markdown

    # This is a header

    Example markdown text.
    """

    string_example: str = Field(..., description="A string.")
    int_example: Annotated[int, Alias(FileSource, ["another_int"])] = Field(
        default=42, description="An integer."
    )
    bool_example: bool = Field(..., description="An integer.")
    nested: NestedConfiguration = Field(..., description="A nested configuration.")
    nested_2: Annotated[NestedConfiguration, Prefixed("hello")] = Field(
        ..., description="A nested configuration."
    )
