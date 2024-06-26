# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow PortMapper class."""

from typing import Any

from pydantic import BaseModel, Field

from reactivedataflow.errors import PortNamesMustBeUniqueError
from reactivedataflow.nodes import EmitMode
from reactivedataflow.utils.equality import IsEqualCheck


class ArrayInputPort(BaseModel, extra="allow"):
    """Specification for an array-based input port."""

    type: str | None = Field(default=None, description="The type of the port.")
    required: bool = Field(
        default=False, description="Whether the input port is required."
    )
    parameter: str | None = Field(
        default=None,
        description="The name of the parameter on the implementing function.",
    )


class NamedInputsPort(BaseModel, extra="allow"):
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


class InputPort(BaseModel, extra="allow"):
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


class OutputPort(BaseModel, extra="allow"):
    """Specification for an output port."""

    name: str = Field(..., description="The name of the port.")
    type: str | None = Field(default=None, description="The type of the port.")
    emits_on: EmitMode | None = Field(
        default=EmitMode.OnChange, description="When the port emits."
    )
    is_equal: IsEqualCheck[Any] | None = Field(
        default=None, description="The equality check to use for the port."
    )


class ConfigPort(BaseModel, extra="allow"):
    """Specification for a configuration field of an verb function."""

    name: str = Field(..., description="The name of the port.")
    type: str | None = Field(default=None, description="The type of the port.")
    required: bool = Field(default=False, description="Whether the port is required.")
    parameter: str | None = Field(
        default=None,
        description="The name of the parameter on the implementing function. If none, the port name will be used instead.",
    )


Port = InputPort | ArrayInputPort | NamedInputsPort | ConfigPort | OutputPort


class Ports:
    """PortMapper class."""

    _ports: list[Port]

    def __init__(self, ports: list[Port]):
        self._ports = ports
        self._validate()

    def _validate(self):
        """Validate the ports."""
        input_names = [port.name for port in self.ports if isinstance(port, InputPort)]
        if len(input_names) != len(set(input_names)):
            raise PortNamesMustBeUniqueError

        config_names = [
            port.name for port in self.ports if isinstance(port, ConfigPort)
        ]
        if len(config_names) != len(set(config_names)):
            raise PortNamesMustBeUniqueError

    @property
    def ports(self) -> list[Port]:
        """Return the ports."""
        return self._ports

    @property
    def config(self) -> list[ConfigPort]:
        """Return the configuration ports."""
        return [port for port in self.ports if isinstance(port, ConfigPort)]

    @property
    def input(self) -> list[InputPort]:
        """Return the input ports."""
        return [port for port in self.ports if isinstance(port, InputPort)]

    @property
    def outputs(self) -> list[OutputPort]:
        """Return the output ports."""
        return [port for port in self._ports if isinstance(port, OutputPort)]

    @property
    def array_input(self) -> ArrayInputPort | None:
        """Return the array input port."""
        return next((p for p in self._ports if isinstance(p, ArrayInputPort)), None)

    @property
    def named_inputs(self) -> NamedInputsPort | None:
        """Return the named inputs port."""
        return next((p for p in self._ports if isinstance(p, NamedInputsPort)), None)
