# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow GraphModel."""

from typing import Any

from pydantic import BaseModel, Field

from .constants import default_output


class InputModel(BaseModel):
    """NodeInput model."""

    node: str = Field(..., description="Node identifier.")
    port: str = Field(default=default_output, description="Port identifier.")


class VerbNodeModel(BaseModel):
    """Processing Node Model."""

    id: str = Field(..., description="Node identifier.")
    verb: str = Field(..., description="The verb name to use.")
    config: dict[str, Any] = Field(
        default_factory=dict, description="Configuration parameters."
    )
    input: dict[str, InputModel] = Field(
        default_factory=dict, description="Input ports."
    )
    array_input: list[InputModel] = Field(
        default_factory=list, description="Array input ports."
    )


class InputNodeModel(BaseModel):
    """Input Node Model."""

    id: str = Field(..., description="Node identifier.")


class GraphModel(BaseModel):
    """Graph Model."""

    inputs: list[InputNodeModel] = Field(
        ..., description="List of input nodes in the graph."
    )
    nodes: list[VerbNodeModel] = Field(
        ..., description="List of processing nodes in the graph."
    )
