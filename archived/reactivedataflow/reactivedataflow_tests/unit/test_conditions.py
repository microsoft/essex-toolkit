# Copyright (c) 2025 Microsoft Corporation.
"""reactivedataflow Conditions Tests."""

from reactivedataflow import VerbInput, VerbOutput
from reactivedataflow.conditions import (
    array_input_has_min_length,
    array_input_values_are_defined,
    array_result_has_min,
    array_result_not_empty,
    output_is_not_none,
)
from reactivedataflow.constants import default_output


def test_array_results_not_empty():
    check = array_result_not_empty()
    inputs = VerbInput()
    outputs = VerbOutput({default_output: []})
    assert check(inputs, outputs) is False

    outputs = VerbOutput({default_output: [1]})
    assert check(inputs, outputs) is True


def test_array_results_has_min():
    check = array_result_has_min(min_count=2)
    inputs = VerbInput()
    outputs = VerbOutput({default_output: []})
    assert check(inputs, outputs) is False

    outputs = VerbOutput({default_output: [1]})
    assert check(inputs, outputs) is False

    outputs = VerbOutput({default_output: [1, 2]})
    assert check(inputs, outputs) is True


def test_array_input_has_min_values():
    check = array_input_has_min_length(min_count=2)
    inputs = VerbInput(array_inputs=[])
    assert check(inputs) is False

    inputs = VerbInput(array_inputs=[1])
    assert check(inputs) is False

    inputs = VerbInput(array_inputs=[1, 2])
    assert check(inputs) is True


def test_array_input_has_defined_values():
    check = array_input_values_are_defined()
    inputs = VerbInput(array_inputs=[])
    assert check(inputs) is False

    inputs = VerbInput(array_inputs=[1, None])
    assert check(inputs) is False

    inputs = VerbInput(array_inputs=[1, 2])
    assert check(inputs) is True


def test_output_is_not_none():
    check = output_is_not_none(default_output)
    inputs = VerbInput()
    outputs = VerbOutput({default_output: None})
    assert check(inputs, outputs) is False

    outputs = VerbOutput({default_output: 1})
    assert check(inputs, outputs) is True
