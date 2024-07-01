# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Verb Tests."""

import asyncio
from typing import cast

import pytest

from reactivedataflow import (
    Input,
    OutputMode,
    Registry,
    VerbInput,
    VerbOutput,
    verb,
)
from reactivedataflow.constants import default_output
from reactivedataflow.errors import VerbNotFoundError
from reactivedataflow.types import AsyncVerbFunction


def test_verb_registration():
    registry = Registry()
    with pytest.raises(VerbNotFoundError):
        registry.get("test_fn")

    @verb(name="test_fn", registry=registry, output_mode=OutputMode.Raw)
    def test_fn(inputs):
        result = sum(inputs.values())
        return VerbOutput(outputs={default_output: result})

    assert registry.get("test_fn").fn == test_fn


def test_raw_verb():
    @verb(name="test_fn", registry=Registry(), output_mode=OutputMode.Raw)
    def test_fn(inputs: VerbInput):
        result = inputs.named_inputs.get("a", 100) + inputs.named_inputs.get("b", 100)
        return VerbOutput(outputs={default_output: result})

    result = test_fn(VerbInput(named_inputs={}))
    assert result.outputs[default_output] == 200
    result = test_fn(VerbInput(named_inputs={"a": 1, "b": 2}))
    assert result.outputs[default_output] == 3


async def test_async_verb():
    registry = Registry()

    @verb(name="test_fn", registry=registry, output_mode=OutputMode.Raw, is_async=True)
    async def test_fn(inputs: VerbInput):
        result = inputs.named_inputs.get("a", 100) + inputs.named_inputs.get("b", 100)
        await asyncio.sleep(0.001)
        return VerbOutput(outputs={default_output: result})

    decorated_fn = cast(AsyncVerbFunction, registry.get_verb_function("test_fn"))

    result = await decorated_fn(VerbInput(named_inputs={}))
    assert result.outputs[default_output] == 200
    result = await decorated_fn(VerbInput(named_inputs={"a": 1, "b": 2}))
    assert result.outputs[default_output] == 3


def test_verb_with_custom_decorators():
    registry = Registry()

    def custom_decorator(fn):
        def wrapper(*args, **kwargs):
            return fn(*args, **kwargs) + 1

        return wrapper

    @verb(
        name="test_fn",
        registry=registry,
        ports=[
            Input(name="a", required=True),
            Input(name="b", required=True),
        ],
        adapters=[custom_decorator],
    )
    def test_fn(a: int, b: int):
        return a + b

    decorated_fn = registry.get_verb_function("test_fn")

    assert test_fn(1, 2) == 3
    decorated_output = decorated_fn(VerbInput(named_inputs={"a": 1, "b": 2}))
    assert decorated_output.outputs[default_output] == 4


def test_verb_with_fire_conditions():
    registry = Registry()
    allow_fire = False

    def condition(inputs):
        return allow_fire

    @verb(
        name="test_fn",
        registry=registry,
        ports=[
            Input(name="a", required=True),
            Input(name="b", required=True),
        ],
        fire_conditions=[condition],
    )
    def test_fn(a: int, b: int) -> int:
        return a + b

    wrapped_fn = registry.get_verb_function("test_fn")

    result = wrapped_fn(VerbInput(named_inputs={"a": 1, "b": 2}))
    assert result.no_output

    allow_fire = True
    result = wrapped_fn(VerbInput(named_inputs={"a": 1, "b": 2}))
    assert result.outputs[default_output] == 3


def test_verb_with_emit_conditions():
    registry = Registry()
    allow_fire = False

    def condition(inputs, results):
        return allow_fire

    @verb(
        name="test_fn",
        ports=[
            Input(name="a", required=True),
            Input(name="b", required=True),
        ],
        emit_conditions=[condition],
        registry=registry,
    )
    def test_fn(a: int, b: int) -> int:
        return a + b

    wrapped_fn = registry.get_verb_function("test_fn")

    result = wrapped_fn(VerbInput(named_inputs={"a": 1, "b": 2}))
    assert result.no_output

    allow_fire = True
    result = wrapped_fn(VerbInput(named_inputs={"a": 1, "b": 2}))
    assert result.outputs[default_output] == 3
