# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Firing Conditions."""

import logging
from typing import Any, TypeVar, cast

from reactivedataflow.nodes import EmitCondition, FireCondition, VerbInput, VerbOutput

from .constants import default_output
from .utils.equality import IsEqualCheck, default_is_equal

_log = logging.getLogger(__name__)


def _check_array_have_min_length(min_length: int):
    def check(inputs: VerbInput):
        return len(inputs.array_inputs) >= min_length if inputs.array_inputs else False

    return check


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

        result = all(is_input_present(input_name) for input_name in required_inputs)
        _log.debug("...checking required inputs %s: %s", required_inputs, result)
        return result

    return check_required_inputs


def require_config(*required_config: str) -> FireCondition:
    """Create a fire condition to require the given configuration values to be present for the function to fire."""

    def check_required_config(inputs: VerbInput):
        def is_config_present(config_name: str):
            return _is_value_in_dict(config_name, inputs.config)

        result = all(is_config_present(config_name) for config_name in required_config)
        _log.debug("...checking required config %s: %s", required_config, result)
        return result

    return check_required_config


def array_input_has_min_length(min_count: int = 1) -> FireCondition:
    """Create a fire condition to require the array input to have at least min_count elements for the function to fire."""
    return _check_array_have_min_length(min_count)


def array_input_values_are_defined() -> FireCondition:
    """Create a fire condition to require the array input values to be defined for the function to fire."""
    return _check_array_input_has_valid_values


T = TypeVar("T")


def array_result_not_empty(name: str = default_output) -> EmitCondition:
    """Create an emit condition to emit when the given array output is non-empty."""
    return array_result_has_min(name)


def array_result_has_min(
    name: str = default_output, min_count: int = 1
) -> EmitCondition:
    """Create an emit condition to emit when the given array output is non-empty."""

    def check_array_results_non_empty(_inputs: VerbInput, outputs: VerbOutput) -> bool:
        result = bool(
            name in outputs.outputs
            and outputs.outputs[name]
            and isinstance(outputs.outputs[name], list)
            and len(outputs.outputs[name]) >= min_count
        )
        _log.debug("...checking array results not empty: %s", result)
        return result

    return check_array_results_non_empty


def output_is_not_none(name: str = default_output) -> EmitCondition:
    """Create an emit condition to emit when the given output is not None."""

    def check_output_is_not_none(_inputs: VerbInput, outputs: VerbOutput) -> bool:
        result = name in outputs.outputs and outputs.outputs[name] is not None
        _log.debug("...checking output is not None: %s", result)
        return result

    return check_output_is_not_none


def output_changed(
    output_name: str = default_output, is_equal: IsEqualCheck[T] = default_is_equal
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

        result = not is_equal(previous, current)
        _log.debug("...checking output changed: %s", result)
        return result

    return check_output_changed
