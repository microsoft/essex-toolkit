# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Emit Conditions Tests."""

import asyncio

from reactivedataflow import VerbInput, VerbOutput, emit_conditions
from reactivedataflow.conditions import output_changed


def returns_true(inputs: VerbInput, result: VerbOutput) -> bool:
    return True


def returns_false(inputs: VerbInput, result: VerbOutput) -> bool:
    return False


async def test_emits_output_when_conditions_pass() -> None:
    @emit_conditions(returns_true)
    async def test_fn2(inputs):
        await asyncio.sleep(0.001)
        return VerbOutput(outputs={"result": "result"})

    result = await test_fn2(VerbInput())
    assert result.no_output is False
    assert result.outputs["result"] == "result"


async def test_emits_no_output_if_conditions_fail() -> None:
    @emit_conditions(returns_true, returns_false)
    async def test_fn(inputs: VerbInput) -> VerbOutput:
        await asyncio.sleep(0.001)
        return VerbOutput(outputs={"result": "result"})

    result = await test_fn(VerbInput())
    assert result.no_output is True
    assert result.outputs == {}


async def test_output_changed():
    return_value = None

    @emit_conditions(output_changed("result"))
    async def test_fn(inputs: VerbInput) -> VerbOutput:
        await asyncio.sleep(0.001)
        return VerbOutput(outputs={"result": return_value})

    result = await test_fn(VerbInput())
    assert result.no_output is True
    assert result.outputs == {}

    return_value = "result"
    result = await test_fn(VerbInput())
    assert result.no_output is False
    assert result.outputs["result"] == "result"

    result = await test_fn(VerbInput(previous_output={"result": return_value}))
    assert result.no_output is True
    assert result.outputs == {}
