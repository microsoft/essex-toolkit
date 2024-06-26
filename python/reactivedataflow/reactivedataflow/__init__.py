# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow Library."""

from .decorators import (
    apply_decorators,
    connect_input,
    connect_output,
    emit_conditions,
    fire_conditions,
    handle_async_output,
    verb,
)
from .execution_graph import ExecutionGraph
from .graph_assembler import GraphAssembler
from .graph_model import GraphModel, InputModel, InputNodeModel, VerbNodeModel
from .nodes import (
    EmitMode,
    ExecutionNode,
    InputMode,
    InputNode,
    Node,
    OutputMode,
    VerbInput,
    VerbOutput,
)
from .ports import (
    ArrayInputPort,
    ConfigPort,
    InputPort,
    NamedInputsPort,
    OutputPort,
    Ports,
)
from .registry import Registry

# Public API
# This brings in all public classes and functions necessary for the user to interact with the library.
# Note: This is not a complete list of all classes and functions in the library.
# It is expected that users will import from a few sub-modules as needed.
# Notably:
# - reactivedataflow.constants - this contains constants values used throughout the library.
# - reactivedataflow.errors - this contains custom error types emitted by the library.
# - reactivedataflow.types - this contains non-constructable type definitions for users of the library.
# - reactivedataflow.conditions - this contains a listing of emit and fire condition functions for users of the library.
__all__ = [
    "ArrayInputPort",
    "ConfigPort",
    "EmitMode",
    "ExecutionGraph",
    "ExecutionNode",
    "GraphAssembler",
    "GraphModel",
    "InputMode",
    "InputModel",
    "InputNode",
    "InputNodeModel",
    "InputPort",
    "NamedInputsPort",
    "Node",
    "OutputMode",
    "OutputPort",
    "Ports",
    "Registry",
    "VerbInput",
    "VerbNodeModel",
    "VerbOutput",
    "apply_decorators",
    "connect_input",
    "connect_output",
    "emit_conditions",
    "fire_conditions",
    "handle_async_output",
    "verb",
]
