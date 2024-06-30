# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow GraphModel."""

from typing import Any

from pydantic import BaseModel, Field

from .constants import default_output


class InputNode(BaseModel):
    """Input Node Model."""

    id: str = Field(..., description="Node identifier.")


class ValRef(BaseModel):
    """A model containing either a value or a reference to a global configuration."""

    value: Any | None = Field(default=None, description="The value.")
    reference: str | None = Field(
        default=None, description="The name of the global configuration to reference."
    )
    type: str | None = Field(default=None, description="The type of the value.")


class Node(BaseModel):
    """Processing Node Model."""

    id: str = Field(..., description="Node identifier.")
    verb: str = Field(..., description="The verb name to use.")
    config: dict[str, str | int | float | bool | ValRef] = Field(
        default_factory=dict, description="Configuration parameters."
    )


class Edge(BaseModel):
    """Edge Model."""

    from_node: str = Field(..., description="Source node identifier.")
    from_port: str = Field(
        default=default_output, description="Source port identifier."
    )
    to_node: str = Field(..., description="Destination node identifier.")
    to_port: str | None = Field(
        default=None,
        description="""
        Destination port identifier.
        If this is None, then this input will be used as an array input.
    """,
    )


class Output(BaseModel):
    """Output model."""

    name: str = Field(..., description="The unique name of the output.")
    node: str | None = Field(default=None, description="Node identifier.")
    port: str = Field(default=default_output, description="Port identifier.")


class Graph(BaseModel):
    """Graph Model."""

    inputs: list[InputNode] = Field(
        default_factory=list, description="List of input nodes in the graph."
    )
    nodes: list[Node] = Field(
        default_factory=list, description="List of processing nodes in the graph."
    )
    edges: list[Edge] = Field(
        default_factory=list, description="List of edges in the graph."
    )
    outputs: list[Output] = Field(
        default_factory=list, description="List of output nodes in the graph."
    )
