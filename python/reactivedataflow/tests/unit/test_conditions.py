# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Conditions Tests."""

from reactivedataflow import VerbInput, VerbOutput
from reactivedataflow.conditions import (
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


def test_output_is_not_none():
    check = output_is_not_none(default_output)
    inputs = VerbInput()
    outputs = VerbOutput({default_output: None})
    assert check(inputs, outputs) is False

    outputs = VerbOutput({default_output: 1})
    assert check(inputs, outputs) is True
