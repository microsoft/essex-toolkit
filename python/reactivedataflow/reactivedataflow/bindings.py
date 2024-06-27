# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow PortMapper class."""

from typing import Any

from pydantic import BaseModel, Field

from reactivedataflow.errors import PortNamesMustBeUniqueError
from reactivedataflow.nodes import EmitMode
from reactivedataflow.utils.equality import IsEqualCheck


class ArrayInputBinding(BaseModel, extra="allow"):
    """Specification for an array-based input port."""

    type: str | None = Field(default=None, description="The type of the port.")
    required: bool = Field(
        default=False, description="Whether the input port is required."
    )
    parameter: str | None = Field(
        default=None,
        description="The name of the parameter on the implementing function.",
    )


class NamedInputsBinding(BaseModel, extra="allow"):
    """Specification for injecting all named inputs as a single dictionary."""

    type: dict[str, str] | None = Field(
        default=None, description="The type of the port."
    )
    required: list[str] = Field(
        default_factory=list, description="What named inputs are required."
    )
    parameter: str | None = Field(
        default=None,
        description="The name of the parameter on the implementing function.",
    )


class InputBinding(BaseModel, extra="allow"):
    """Specification for a named input port."""

    name: str = Field(..., description="The name of the port.")
    type: str | None = Field(default=None, description="The type of the port.")
    required: bool = Field(
        default=False, description="Whether the input port is required."
    )
    parameter: str | None = Field(
        default=None,
        description="The name of the parameter on the implementing function.  If none, the port name will be used instead.",
    )


class OutputBinding(BaseModel, extra="allow"):
    """Specification for an output port."""

    name: str = Field(..., description="The name of the port.")
    type: str | None = Field(default=None, description="The type of the port.")
    emits_on: EmitMode | None = Field(
        default=EmitMode.OnChange, description="When the port emits."
    )
    is_equal: IsEqualCheck[Any] | None = Field(
        default=None, description="The equality check to use for the port."
    )


class ConfigBinding(BaseModel, extra="allow"):
    """Specification for a configuration field of an verb function."""

    name: str = Field(..., description="The name of the port.")
    type: str | None = Field(default=None, description="The type of the port.")
    required: bool = Field(default=False, description="Whether the port is required.")
    parameter: str | None = Field(
        default=None,
        description="The name of the parameter on the implementing function. If none, the port name will be used instead.",
    )


Binding = (
    InputBinding
    | ArrayInputBinding
    | NamedInputsBinding
    | ConfigBinding
    | OutputBinding
)


class Bindings:
    """Node Binding Managemer class.

    Node bindings are used to map processing-graph inputs, outputs, and configuration values into the appropriate
    function parameters. This class is used to manage the bindings for a node.
    """

    _bindings: list[Binding]

    def __init__(self, ports: list[Binding]):
        self._bindings = ports
        self._validate()

    def _validate(self):
        """Validate the ports."""
        input_names = [
            port.name for port in self.ports if isinstance(port, InputBinding)
        ]
        if len(input_names) != len(set(input_names)):
            raise PortNamesMustBeUniqueError

        config_names = [
            port.name for port in self.ports if isinstance(port, ConfigBinding)
        ]
        if len(config_names) != len(set(config_names)):
            raise PortNamesMustBeUniqueError

    @property
    def ports(self) -> list[Binding]:
        """Return the ports."""
        return self._bindings

    @property
    def config(self) -> list[ConfigBinding]:
        """Return the configuration ports."""
        return [port for port in self.ports if isinstance(port, ConfigBinding)]

    @property
    def input(self) -> list[InputBinding]:
        """Return the input ports."""
        return [port for port in self.ports if isinstance(port, InputBinding)]

    @property
    def outputs(self) -> list[OutputBinding]:
        """Return the output ports."""
        return [port for port in self._bindings if isinstance(port, OutputBinding)]

    @property
    def array_input(self) -> ArrayInputBinding | None:
        """Return the array input port."""
        return next(
            (p for p in self._bindings if isinstance(p, ArrayInputBinding)), None
        )

    @property
    def named_inputs(self) -> NamedInputsBinding | None:
        """Return the named inputs port."""
        return next(
            (p for p in self._bindings if isinstance(p, NamedInputsBinding)), None
        )
