# Copyright (c) 2025 Microsoft Corporation.
"""Output decorator tests."""

import asyncio

import pytest
from reactivedataflow import (
    OutputMode,
    VerbOutput,
    connect_output,
)
from reactivedataflow.constants import default_output
from reactivedataflow.errors import (
    OutputNamesMissingInTupleOutputModeError,
    OutputNamesNotValidInValueOutputModeError,
)


def test_outputs_raises_when_output_names_are_missing():
    def decorate():
        @connect_output(mode=OutputMode.Tuple)
        async def stub():
            await asyncio.sleep(0.001)
            return 1, 2, 3

    with pytest.raises(OutputNamesMissingInTupleOutputModeError):
        decorate()


async def test_outputs_raises_when_output_names_mismatch_num_outputs():
    @connect_output(mode=OutputMode.Tuple, output_names=["a"])
    async def stub():
        await asyncio.sleep(0.001)
        return 1, 2, 3

    with pytest.raises(ValueError):  # noqa PT011 (emitted from zip() function)
        await stub()


async def test_tuple_mode_output():
    @connect_output(mode=OutputMode.Tuple, output_names=[default_output, "a", "b"])
    async def stub():
        await asyncio.sleep(0.001)
        return 1, 2, 3

    result = await stub()
    assert result.outputs == {default_output: 1, "a": 2, "b": 3}


def test_value_mode_output_with_output_names_throws():
    def decorate():
        @connect_output(mode=OutputMode.Value, output_names=["a", "b"])
        async def stub():
            await asyncio.sleep(0.001)
            return 123

    with pytest.raises(OutputNamesNotValidInValueOutputModeError):
        decorate()


async def test_value_mode_output():
    @connect_output(mode=OutputMode.Value)
    async def stub():
        await asyncio.sleep(0.001)
        return 123

    result = await stub()
    assert result.outputs == {default_output: 123}
    assert not result.no_output


async def test_raw_mode_output():
    @connect_output(mode=OutputMode.Raw)
    async def stub() -> VerbOutput:
        await asyncio.sleep(0.001)
        return VerbOutput(outputs={default_output: 123})

    result = await stub()
    assert result.outputs == {default_output: 123}
    assert not result.no_output
