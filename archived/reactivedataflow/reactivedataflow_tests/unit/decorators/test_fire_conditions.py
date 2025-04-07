# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Emit Conditions Tests."""

import asyncio

from reactivedataflow import VerbInput, VerbOutput, fire_conditions


def returns_true(inputs: VerbInput) -> bool:
    return True


def returns_false(inputs: VerbInput) -> bool:
    return False


async def test_emits_output_when_conditions_pass() -> None:
    @fire_conditions(returns_true)
    async def test_fn2(inputs):
        await asyncio.sleep(0.001)
        return VerbOutput(outputs={"result": "result"})

    result = await test_fn2(VerbInput())
    assert result.no_output is False
    assert result.outputs["result"] == "result"


async def test_emits_no_output_if_conditions_fail() -> None:
    @fire_conditions(returns_true, returns_false)
    async def test_fn(inputs: VerbInput) -> VerbOutput:
        await asyncio.sleep(0.001)
        return VerbOutput(outputs={"result": "result"})

    result = await test_fn(VerbInput())
    assert result.no_output is True
    assert result.outputs == {}
