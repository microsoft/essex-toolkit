# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Firing Conditions."""

from typing import Any, TypeVar, cast

from reactivedataflow.nodes import EmitCondition, FireCondition, VerbInput, VerbOutput

from .utils.equality import IsEqualCheck, default_is_equal


def _check_array_input_not_empty(inputs: VerbInput):
    return len(inputs.array_inputs) > 0 if inputs.array_inputs else False


def _check_array_input_has_valid_values(inputs: VerbInput):
    return (
        all(value is not None for value in inputs.array_inputs)
        if inputs.array_inputs
        else False
    )


def _is_value_in_dict(name: str, config: dict[str, Any]):
    return name in config and config[name] is not None


def require_inputs(*required_inputs: str) -> FireCondition:
    """Create a fire condition to require the given inputs to be present for the function to fire."""

    def check_required_inputs(inputs: VerbInput):
        def is_input_present(input_name: str):
            return _is_value_in_dict(input_name, inputs.named_inputs)

        return all(is_input_present(input_name) for input_name in required_inputs)

    return check_required_inputs


def require_config(*required_inputs: str) -> FireCondition:
    """Create a fire condition to require the given configuration values to be present for the function to fire."""

    def check_required_config(inputs: VerbInput):
        def is_config_present(input_name: str):
            return _is_value_in_dict(input_name, inputs.config)

        return all(is_config_present(input_name) for input_name in required_inputs)

    return check_required_config


def array_input_not_empty() -> FireCondition:
    """Create a fire condition to r the array input to be non-empty for the function to fire."""
    return _check_array_input_not_empty


def array_input_values_are_defined() -> FireCondition:
    """Create a fire condition to require the array input values to be defined for the function to fire."""
    return _check_array_input_has_valid_values


T = TypeVar("T")


def output_changed(
    output_name: str, is_equal: IsEqualCheck[T] = default_is_equal
) -> EmitCondition:
    """Create an emit condition to emit when the given output has changed."""

    def check_output_changed(inputs: VerbInput, outputs: VerbOutput):
        previous: T | None = inputs.previous_output.get(output_name)
        current: T | None = outputs.outputs.get(output_name)

        if previous is None and current is None:
            return False
        if previous is None or current is None:
            return True

        previous = cast(T, previous)
        current = cast(T, current)

        return not is_equal(previous, current)

    return check_output_changed
