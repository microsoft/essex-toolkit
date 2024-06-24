# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Emit Conditions Tests."""

from reactivedataflow import VerbInput, VerbOutput, fire_conditions


def returns_true(inputs: VerbInput) -> bool:
    return True


def returns_false(inputs: VerbInput) -> bool:
    return False


def test_emits_output_when_conditions_pass() -> None:
    @fire_conditions(returns_true)
    def test_fn2(inputs):
        return VerbOutput(outputs={"result": "result"})

    result = test_fn2(VerbInput())
    assert result.no_output is False
    assert result.outputs["result"] == "result"


def test_emits_no_output_if_conditions_fail() -> None:
    @fire_conditions(returns_true, returns_false)
    def test_fn(inputs: VerbInput) -> VerbOutput:
        return VerbOutput(outputs={"result": "result"})

    result = test_fn(VerbInput())
    assert result.no_output is True
    assert result.outputs == {}
