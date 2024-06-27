# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow GraphModel."""

from typing import Any

from pydantic import BaseModel, Field

from .constants import default_output


class Input(BaseModel):
    """NodeInput model."""

    node: str = Field(..., description="Node identifier.")
    port: str = Field(default=default_output, description="Port identifier.")


class ProcessingNode(BaseModel):
    """Processing Node Model."""

    id: str = Field(..., description="Node identifier.")
    verb: str = Field(..., description="The verb name to use.")
    config: dict[str, Any] = Field(
        default_factory=dict, description="Configuration parameters."
    )
    input: dict[str, Input] = Field(default_factory=dict, description="Input ports.")
    array_input: list[Input] = Field(
        default_factory=list, description="Array input ports."
    )


class InputNode(BaseModel):
    """Input Node Model."""

    id: str = Field(..., description="Node identifier.")


class Graph(BaseModel):
    """Graph Model."""

    inputs: list[InputNode] = Field(
        ..., description="List of input nodes in the graph."
    )
    nodes: list[ProcessingNode] = Field(
        ..., description="List of processing nodes in the graph."
    )