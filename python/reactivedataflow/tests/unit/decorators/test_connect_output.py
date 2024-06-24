# Copyright (c) 2024 Microsoft Corporation.
"""Output decorator tests."""

import asyncio

import pytest

from reactivedataflow import (
    OutputMode,
    VerbOutput,
    connect_output,
    handle_async_output,
)
from reactivedataflow.constants import default_output
from reactivedataflow.errors import (
    OutputNamesMissingInTupleOutputModeError,
    OutputNamesNotValidInValueOutputModeError,
)


def test_outputs_raises_when_output_names_are_missing():
    def decorate():
        @connect_output(mode=OutputMode.Tuple)
        def stub():
            return 1, 2, 3

    with pytest.raises(OutputNamesMissingInTupleOutputModeError):
        decorate()


def test_outputs_raises_when_output_names_mismatch_num_outputs():
    @connect_output(mode=OutputMode.Tuple, output_names=["a"])
    def stub():
        return 1, 2, 3

    with pytest.raises(ValueError):  # noqa PT011 (emitted from zip() function)
        stub()


def test_tuple_mode_output():
    @connect_output(mode=OutputMode.Tuple, output_names=[default_output, "a", "b"])
    def stub():
        return 1, 2, 3

    result = stub()
    assert result.outputs == {default_output: 1, "a": 2, "b": 3}


def test_value_mode_output_with_output_names_throws():
    def decorate():
        @connect_output(mode=OutputMode.Value, output_names=["a", "b"])
        def stub():
            return 123

    with pytest.raises(OutputNamesNotValidInValueOutputModeError):
        decorate()


def test_value_mode_output():
    @connect_output(mode=OutputMode.Value)
    def stub():
        return 123

    result = stub()
    assert result.outputs == {default_output: 123}
    assert not result.no_output


def test_raw_mode_output():
    @connect_output(mode=OutputMode.Raw)
    def stub() -> VerbOutput:
        return VerbOutput(outputs={default_output: 123})

    result = stub()
    assert result.outputs == {default_output: 123}
    assert not result.no_output


def test_async_output():
    @connect_output(mode=OutputMode.Value)
    @handle_async_output()
    async def stub():
        await asyncio.sleep(0.001)
        return 1

    result = stub()
    assert result.outputs == {default_output: 1}
