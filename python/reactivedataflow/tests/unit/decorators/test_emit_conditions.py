# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Emit Conditions Tests."""

from reactivedataflow import VerbInput, VerbOutput, emit_conditions
from reactivedataflow.conditions import output_changed


def returns_true(inputs: VerbInput, result: VerbOutput) -> bool:
    return True


def returns_false(inputs: VerbInput, result: VerbOutput) -> bool:
    return False


def test_emits_output_when_conditions_pass() -> None:
    @emit_conditions(returns_true)
    def test_fn2(inputs):
        return VerbOutput(outputs={"result": "result"})

    result = test_fn2(VerbInput())
    assert result.no_output is False
    assert result.outputs["result"] == "result"


def test_emits_no_output_if_conditions_fail() -> None:
    @emit_conditions(returns_true, returns_false)
    def test_fn(inputs: VerbInput) -> VerbOutput:
        return VerbOutput(outputs={"result": "result"})

    result = test_fn(VerbInput())
    assert result.no_output is True
    assert result.outputs == {}


def test_output_changed():
    return_value = None

    @emit_conditions(output_changed("result"))
    def test_fn(inputs: VerbInput) -> VerbOutput:
        return VerbOutput(outputs={"result": return_value})

    result = test_fn(VerbInput())
    assert result.no_output is True
    assert result.outputs == {}

    return_value = "result"
    result = test_fn(VerbInput())
    assert result.no_output is False
    assert result.outputs["result"] == "result"

    result = test_fn(VerbInput(previous_output={"result": return_value}))
    assert result.no_output is True
    assert result.outputs == {}
