# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Verb Registry."""

from reactivedataflow.bindings import Config, Input
from reactivedataflow.conditions import (
    array_input_values_are_defined,
    output_changed,
    require_config,
    require_inputs,
)
from reactivedataflow.decorators.apply_decorators import apply_decorators
from reactivedataflow.decorators.connect_input import connect_input
from reactivedataflow.decorators.connect_output import connect_output
from reactivedataflow.decorators.emit_conditions import (
    emit_conditions as emitting_conditions_decorator,
)
from reactivedataflow.decorators.fire_conditions import (
    fire_conditions as firing_conditions_decorator,
)
from reactivedataflow.decorators.handle_async_output import handle_async_output
from reactivedataflow.nodes import (
    EmitCondition,
    EmitMode,
    FireCondition,
    InputMode,
    OutputMode,
    VerbFunction,
)

from .registry import Registration


def verb_constructor(
    registration: Registration,
) -> VerbFunction:
    """Wrap a verb function with reactive-dataflow plumbing."""
    fn = registration.fn
    fire_conditions = registration.fire_conditions + _infer_firing_conditions(
        registration
    )
    emit_conditions = registration.emit_conditions + _infer_emit_conditions(
        registration
    )
    decorators: list = registration.adapters.copy()

    def push(x):
        decorators.insert(0, x)

    if registration.is_async:
        push(handle_async_output())

    if registration.output_mode != OutputMode.Raw:
        push(
            connect_output(
                mode=registration.output_mode, output_names=registration.output_names
            )
        )

    if registration.input_mode == InputMode.PortMapped:
        input_parameter_map = _input_parameter_map(registration.bindings.input)
        config_parameter_map = _config_parameter_map(registration.bindings.config)
        array_inputs_parameter: str | None = (
            registration.bindings.array_input
            and registration.bindings.array_input.parameter
        )
        dict_inputs_parameter: str | None = (
            registration.bindings.named_inputs
            and registration.bindings.named_inputs.parameter
        )
        is_input_connection_required = (
            len(input_parameter_map) > 0
            or len(config_parameter_map) > 0
            or array_inputs_parameter
            or dict_inputs_parameter
        )
        if is_input_connection_required:
            push(connect_input(bindings=registration.bindings))

    if len(fire_conditions) > 0:
        push(firing_conditions_decorator(*fire_conditions))
    if len(emit_conditions) > 0:
        push(emitting_conditions_decorator(*emit_conditions))

    return apply_decorators(fn, decorators)


def _infer_firing_conditions(
    registration: Registration,
) -> list[FireCondition]:
    firing_conditions = []
    required_inputs: list[str] = [
        p.name for p in registration.bindings.input if p.required
    ]
    required_config: list[str] = [
        p.name for p in registration.bindings.config if p.required
    ]

    if registration.bindings.array_input and registration.bindings.array_input.required:
        firing_conditions.append(array_input_values_are_defined())
    if (
        registration.bindings.named_inputs
        and registration.bindings.named_inputs.required
    ):
        required_inputs.extend(registration.bindings.named_inputs.required)

    if len(required_inputs) > 0:
        firing_conditions.append(require_inputs(*required_inputs))
    if len(required_config) > 0:
        firing_conditions.append(require_config(*required_config))

    return firing_conditions


def _infer_emit_conditions(
    registration: Registration,
) -> list[EmitCondition]:
    result: list[EmitCondition] = []

    # Create a composite emit condition. Any output that emits a changed value will allow an emit.
    ports = [
        p for p in registration.bindings.outputs if p.emits_on == EmitMode.OnChange
    ]
    if len(ports) > 0:
        change_checks = [output_changed(p.name) for p in ports]

        def any_output_changed(inputs, outputs):
            return any(c(inputs, outputs) for c in change_checks)

        result.append(any_output_changed)

    return result


def _input_parameter_map(
    inputs: list[Input],
) -> dict[str, str]:
    result: dict[str, str] = {}
    for port in inputs:
        result[port.name] = port.parameter or port.name
    return result


def _config_parameter_map(
    config: list[Config],
) -> dict[str, str]:
    result: dict[str, str] = {}
    for port in config:
        result[port.name] = port.parameter or port.name
    return result
