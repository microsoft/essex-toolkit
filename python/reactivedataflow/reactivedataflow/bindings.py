# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow PortMapper class."""

from typing import Any

from pydantic import BaseModel, Field

from reactivedataflow.errors import PortNamesMustBeUniqueError
from reactivedataflow.nodes import EmitMode
from reactivedataflow.utils.equality import IsEqualCheck


class ArrayInput(BaseModel, extra="allow"):
    """Specification for an array-based input binding."""

    type: str | None = Field(
        default=None, description="The item-type of the array input port."
    )
    required: int | None = Field(
        default=None, description="The minimum number of array inputs required."
    )
    parameter: str | None = Field(
        default=None,
        description="The name of the parameter on the implementing function.",
    )


class NamedInputs(BaseModel, extra="allow"):
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


class Input(BaseModel, extra="allow"):
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


class Output(BaseModel, extra="allow"):
    """Specification for an output port."""

    name: str = Field(..., description="The name of the port.")
    type: str | None = Field(default=None, description="The type of the port.")
    emits_on: EmitMode | None = Field(
        default=EmitMode.OnChange, description="When the port emits."
    )
    is_equal: IsEqualCheck[Any] | None = Field(
        default=None, description="The equality check to use for the port."
    )


class Config(BaseModel, extra="allow"):
    """Specification for a configuration field of an verb function."""

    name: str = Field(..., description="The name of the port.")
    type: str | None = Field(default=None, description="The type of the port.")
    required: bool = Field(default=False, description="Whether the port is required.")
    parameter: str | None = Field(
        default=None,
        description="The name of the parameter on the implementing function. If none, the port name will be used instead.",
    )


Binding = Input | ArrayInput | NamedInputs | Config | Output


class Bindings:
    """Node Binding Manager class.

    Node bindings are used to map processing-graph inputs, outputs, and configuration values into the appropriate
    function parameters. This class is used to manage the bindings for a node.
    """

    _bindings: list[Binding]

    def __init__(self, bindings: list[Binding]):
        """Initialize the Bindings object.

        Args:
            bindings: The list of bindings for the node.
        """
        self._bindings = bindings
        self._validate()

    def _validate(self):
        """Validate the ports."""
        input_names = [port.name for port in self.bindings if isinstance(port, Input)]
        if len(input_names) != len(set(input_names)):
            raise PortNamesMustBeUniqueError

        config_names = [port.name for port in self.bindings if isinstance(port, Config)]
        if len(config_names) != len(set(config_names)):
            raise PortNamesMustBeUniqueError

    @property
    def bindings(self) -> list[Binding]:
        """Return the bindings."""
        return self._bindings

    @property
    def config(self) -> list[Config]:
        """Return the configuration bindings."""
        return [b for b in self.bindings if isinstance(b, Config)]

    @property
    def input(self) -> list[Input]:
        """Return the input bindings."""
        return [b for b in self.bindings if isinstance(b, Input)]

    @property
    def outputs(self) -> list[Output]:
        """Return the output bindings."""
        return [b for b in self._bindings if isinstance(b, Output)]

    @property
    def array_input(self) -> ArrayInput | None:
        """Return the array input binding."""
        return next((p for p in self._bindings if isinstance(p, ArrayInput)), None)

    @property
    def named_inputs(self) -> NamedInputs | None:
        """Return the named inputs binding."""
        return next((p for p in self._bindings if isinstance(p, NamedInputs)), None)

    @property
    def input_names(self) -> set[str]:
        """Return the names of the inputs."""
        return {p.name for p in self.input}

    @property
    def config_names(self) -> set[str]:
        """Return the names of the config."""
        return {p.name for p in self.config}

    @property
    def output_names(self) -> set[str]:
        """Return the names of the outputs."""
        return {p.name for p in self.outputs}

    @property
    def required_input_names(self) -> set[str]:
        """Return the required named inputs."""
        result = {p.name for p in self.input if p.required}
        if self.named_inputs:
            result.update(self.named_inputs.required)
        return result

    @property
    def required_config_names(self) -> set[str]:
        """Return the required named inputs."""
        return {p.name for p in self.config if p.required}
