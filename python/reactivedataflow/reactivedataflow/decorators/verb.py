# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Verb Decorator."""

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any, ParamSpec

from reactivedataflow.conditions import (
    array_input_values_are_defined,
    output_changed,
    require_config,
    require_inputs,
)
from reactivedataflow.nodes import (
    EmitCondition,
    EmitMode,
    FireCondition,
    InputMode,
    OutputMode,
    VerbFunction,
)
from reactivedataflow.ports import ConfigPort, InputPort, Port, Ports
from reactivedataflow.registry import Registration, Registry

from .apply_decorators import apply_decorators
from .connect_input import connect_input
from .connect_output import connect_output
from .emit_conditions import emit_conditions as emitting_conditions_decorator
from .fire_conditions import fire_conditions as firing_conditions_decorator
from .handle_async_output import handle_async_output

P = ParamSpec("P")


@dataclass
class VerbSpecification:
    """A container class for verb specifications and augmentation."""

    ports: Ports
    adapters: list[Callable[[Callable[..., Any]], Callable[..., Any]]]
    fire_conditions: list[FireCondition]
    emit_conditions: list[EmitCondition]
    input_mode: InputMode
    output_mode: OutputMode
    output_names: list[str] | None
    is_async: bool


def verb(
    name: str,
    adapters: list[Callable[[Callable[..., Any]], Callable[..., Any]]] | None = None,
    fire_conditions: list[FireCondition] | None = None,
    emit_conditions: list[EmitCondition] | None = None,
    ports: list[Port] | None = None,
    registry: Registry | None = None,
    input_mode: InputMode | None = None,
    output_mode: OutputMode | None = None,
    output_names: list[str] | None = None,
    is_async: bool | None = None,
    override: bool | None = None,
) -> Callable[[Callable[P, Any]], Callable[P, Any]]:
    """Register an verb function with the given name."""
    registry = registry or Registry.get_instance()
    spec = VerbSpecification(
        ports=Ports(ports or []),
        fire_conditions=fire_conditions or [],
        emit_conditions=emit_conditions or [],
        adapters=adapters or [],
        is_async=is_async or False,
        input_mode=input_mode or InputMode.PortMapped,
        output_mode=output_mode or OutputMode.Value,
        output_names=output_names,
    )

    def wrap_fn(verb: Callable[P, Any]) -> Callable[P, Any]:
        fn = _wrap_verb_fn(verb, spec)
        registration = Registration(fn, spec.ports)
        registry.register(
            name,
            registration,
            override=override,
        )
        return verb

    return wrap_fn


def _wrap_verb_fn(
    fn: Callable[P, Any],
    spec: VerbSpecification,
) -> VerbFunction:
    fire_conditions = spec.fire_conditions + _infer_firing_conditions(spec)
    emit_conditions = spec.emit_conditions + _infer_emit_conditions(spec)
    decorators: list = spec.adapters.copy()

    def push(x):
        decorators.insert(0, x)

    if spec.is_async:
        push(handle_async_output())

    if spec.output_mode != OutputMode.Raw:
        push(connect_output(mode=spec.output_mode, output_names=spec.output_names))

    if spec.input_mode == InputMode.PortMapped:
        input_parameter_map = _input_parameter_map(spec.ports.input)
        config_parameter_map = _config_parameter_map(spec.ports.config)
        array_inputs_parameter: str | None = (
            spec.ports.array_input and spec.ports.array_input.parameter
        )
        dict_inputs_parameter: str | None = (
            spec.ports.named_inputs and spec.ports.named_inputs.parameter
        )
        is_input_connection_required = (
            len(input_parameter_map) > 0
            or len(config_parameter_map) > 0
            or array_inputs_parameter
            or dict_inputs_parameter
        )
        if is_input_connection_required:
            push(connect_input(ports=spec.ports))

    if len(fire_conditions) > 0:
        push(firing_conditions_decorator(*fire_conditions))
    if len(emit_conditions) > 0:
        push(emitting_conditions_decorator(*emit_conditions))

    return apply_decorators(fn, decorators)


def _infer_firing_conditions(
    spec: VerbSpecification,
) -> list[FireCondition]:
    firing_conditions = []
    required_inputs: list[str] = [p.name for p in spec.ports.input if p.required]
    required_config: list[str] = [p.name for p in spec.ports.config if p.required]

    if spec.ports.array_input and spec.ports.array_input.required:
        firing_conditions.append(array_input_values_are_defined())
    if spec.ports.named_inputs and spec.ports.named_inputs.required:
        required_inputs.extend(spec.ports.named_inputs.required)

    if len(required_inputs) > 0:
        firing_conditions.append(require_inputs(*required_inputs))
    if len(required_config) > 0:
        firing_conditions.append(require_config(*required_config))

    return firing_conditions


def _infer_emit_conditions(
    spec: VerbSpecification,
) -> list[EmitCondition]:
    result: list[EmitCondition] = []

    # Create a composite emit condition. Any output that emits a changed value will allow an emit.
    ports = [p for p in spec.ports.outputs if p.emits_on == EmitMode.OnChange]
    if len(ports) > 0:
        change_checks = [output_changed(p.name) for p in ports]

        def any_output_changed(inputs, outputs):
            return any(c(inputs, outputs) for c in change_checks)

        result.append(any_output_changed)

    return result


def _input_parameter_map(
    inputs: list[InputPort],
) -> dict[str, str]:
    result: dict[str, str] = {}
    for port in inputs:
        result[port.name] = port.parameter or port.name
    return result


def _config_parameter_map(
    config: list[ConfigPort],
) -> dict[str, str]:
    result: dict[str, str] = {}
    for port in config:
        result[port.name] = port.parameter or port.name
    return result
