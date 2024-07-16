# Copyright (c) 2024 Microsoft Corporation.
"""Tests for the ExecutionNode class."""

from typing import Any

import reactivex as rx

from reactivedataflow import (
    ExecutionNode,
    OutputMode,
    VerbInput,
    verb,
)
from reactivedataflow.nodes import InputMode
from reactivedataflow.ports import (
    ArrayInput,
    Config,
    Input,
    NamedInputs,
    Output,
)
from reactivedataflow.registry import Registry


async def test_configure_and_reconfigure():
    registry = Registry()

    @verb(
        "execute",
        ports=[Config(name="value", required=True)],
        input_mode=InputMode.Raw,
        registry=registry,
    )
    def execute(inputs: VerbInput) -> Any:
        return inputs.config.get("value")

    wrapped_fn = registry.get_verb_function("execute")
    node = ExecutionNode("a", wrapped_fn, config={"value": "Hello"})
    await node.drain()
    assert node.config.get("value") == "Hello"
    assert node.output_value() == "Hello"

    node.config = {"value": "World"}
    await node.drain()
    assert node.config.get("value") == "World"
    assert node.output_value() == "World"


async def test_execution_node_with_raw_input():
    registry = Registry()

    @verb(
        "execute",
        registry=registry,
    )
    def execute(inputs: VerbInput) -> str:
        return (
            inputs.named_inputs.get("input_1", "")
            + " "
            + inputs.named_inputs.get("input_2", "")
        )

    wrapped_fn = registry.get_verb_function("execute")

    output: str | None = None
    node = ExecutionNode("a", wrapped_fn)

    def on_output(o: str):
        nonlocal output
        output = o

    node.output().subscribe(on_output)
    node.attach({
        "input_1": rx.of("Hello"),
        "input_2": rx.of("World"),
    })
    await node.drain()
    assert output == "Hello World"


async def test_execution_node_with_named_inputs():
    registry = Registry()

    @verb(
        "execute",
        ports=[NamedInputs(parameter="inputs")],
        registry=registry,
    )
    def execute(inputs: dict[str, str]) -> str:
        return inputs.get("input_1", "") + " " + inputs.get("input_2", "")

    wrapped_fn = registry.get_verb_function("execute")

    output: str | None = None
    node = ExecutionNode("a", wrapped_fn)
    await node.drain()

    def on_output(o: str):
        nonlocal output
        output = o

    node.output().subscribe(on_output)
    assert output == " "
    node.attach({
        "input_1": rx.of("Hello"),
        "input_2": rx.of("World"),
    })
    await node.drain()
    assert output == "Hello World"


async def test_execution_node_with_named_required_inputs():
    registry = Registry()

    @verb(
        "execute",
        ports=[NamedInputs(parameter="inputs", required_keys=["input_1", "input_2"])],
        registry=registry,
    )
    def execute(inputs: dict[str, str]) -> str:
        return inputs["input_1"] + " " + inputs["input_2"]

    wrapped_fn = registry.get_verb_function("execute")

    output: str | None = None
    node = ExecutionNode("a", wrapped_fn)

    def on_output(o: str):
        nonlocal output
        output = o

    node.output().subscribe(on_output)
    assert output is None
    node.attach({
        "input_1": rx.of("Hello"),
        "input_2": rx.of("World"),
    })
    await node.drain()
    assert output == "Hello World"


async def test_execution_node_with_required_inputs():
    registry = Registry()

    @verb(
        "execute_with_required_inputs",
        ports=[
            Input(name="input_1", required=True),
            Input(name="input_2", required=True),
        ],
        input_mode=InputMode.Raw,
        registry=registry,
    )
    def execute_with_required_inputs(inputs: VerbInput) -> str:
        return inputs.named_inputs["input_1"] + " " + inputs.named_inputs["input_2"]

    output: str | None = None
    fn = registry.get_verb_function("execute_with_required_inputs")
    node = ExecutionNode("a", fn)
    assert node.id == "a"

    def on_output(o: str):
        nonlocal output
        output = o

    node.output().subscribe(on_output)
    node.attach({
        "input_1": rx.of("Hello"),
        "input_2": rx.of("World"),
    })
    await node.drain()
    assert output == "Hello World"


async def test_execution_node_with_required_config():
    registry = Registry()

    @verb(
        "execute_with_required_config",
        ports=[
            Config(name="conf_1", required=True),
            Config(name="conf_2", required=True),
        ],
        input_mode=InputMode.Raw,
        registry=registry,
    )
    def execute_with_required_inputs(inputs: VerbInput) -> str:
        return inputs.config["conf_1"] + " " + inputs.config["conf_2"]

    output: str | None = None
    fn = registry.get_verb_function("execute_with_required_config")
    node = ExecutionNode("a", fn)
    assert node.id == "a"

    def on_output(o: str):
        nonlocal output
        output = o

    node.output().subscribe(on_output)
    node.config = {
        "conf_1": "Hello",
        "conf_2": "World",
    }
    await node.drain()
    assert output == "Hello World"


async def test_execution_node_with_required_config_and_inputs():
    registry = Registry()

    @verb(
        "execute_with_required_config",
        ports=[
            Input(name="input_1", required=True),
            Config(name="conf_1", required=True),
            Config(name="conf_2", required=True),
        ],
        input_mode=InputMode.Raw,
        registry=registry,
    )
    def execute_with_required_inputs(inputs: VerbInput) -> str:
        return " ".join([
            inputs.named_inputs["input_1"],
            inputs.config["conf_1"],
            inputs.config["conf_2"],
        ])

    output: str | None = None
    fn = registry.get_verb_function("execute_with_required_config")
    node = ExecutionNode("a", fn)
    assert node.id == "a"

    def on_output(o: str):
        nonlocal output
        output = o

    node.output().subscribe(on_output)
    node.config = {
        "conf_1": "Hello",
        "conf_2": "World",
    }
    await node.drain()
    assert output is None
    node.attach({
        "input_1": rx.of("Hi"),
    })
    await node.drain()
    assert output == "Hi Hello World"


async def test_execution_node_with_optional_inputs():
    registry = Registry()

    @verb(
        "execute_with_optional_inputs",
        ports=[
            Input(name="input_1", parameter="x"),
            Input(name="input_2", parameter="y"),
        ],
        registry=registry,
    )
    def execute_with_optional_named_inputs(x: str | None, y: str | None) -> str:
        x = x or ""
        y = y or ""
        return f"{x} {y}"

    wrapped_fn = registry.get_verb_function("execute_with_optional_inputs")

    output: str | None = None
    node = ExecutionNode("a", wrapped_fn)

    def on_output(o: str):
        nonlocal output
        output = o

    node.output().subscribe(on_output)
    node.attach({"input_1": rx.of("Hello")})
    await node.drain()
    assert output == "Hello "
    node.attach({"input_1": rx.of("Hello"), "input_2": rx.of("World")})
    await node.drain()
    assert output == "Hello World"


async def test_execution_node_with_multiple_outputs():
    registry = Registry()

    @verb(
        "execute_with_two_outputs",
        ports=[
            Input(name="input_1", parameter="x"),
            Input(name="input_2", parameter="y"),
            Output(name="output_1"),
            Output(name="output_2"),
        ],
        output_names=["output_1", "output_2"],
        output_mode=OutputMode.Tuple,
        registry=registry,
    )
    def execute_with_two_outputs(x: str | None, y: str | None):
        output_1 = f"{x} {y}"
        output_2 = f"{y} {x}"
        return output_1, output_2

    wrapped_fn = registry.get_verb_function("execute_with_two_outputs")

    node = ExecutionNode("a", wrapped_fn)
    output_1: str | None = None
    output_2: str | None = None

    def on_output_1(o: str):
        nonlocal output_1
        output_1 = o

    def on_output_2(o: str):
        nonlocal output_2
        output_2 = o

    node.output("output_1").subscribe(on_output_1)
    node.output("output_2").subscribe(on_output_2)
    node.attach({
        "input_1": rx.of("Hello"),
        "input_2": rx.of("World"),
    })
    await node.drain()
    assert output_1 == "Hello World"
    assert output_2 == "World Hello"


async def test_execution_node_with_array_inputs():
    registry = Registry()

    @verb(
        "execute_with_array_inputs",
        ports=[ArrayInput(parameter="values")],
        registry=registry,
    )
    def execute_with_array_inputs(values: list[int]) -> int:
        if not values or not all(isinstance(v, int) for v in values):
            return 0
        return sum(values)

    wrapped_fn = registry.get_verb_function("execute_with_array_inputs")
    node = ExecutionNode("a", wrapped_fn)
    output: str | None = None

    def on_output(o: str):
        nonlocal output
        output = o

    node.output().subscribe(on_output)
    node.attach(array_inputs=[rx.just(1), rx.just(2)])
    await node.drain()
    assert output == 3
    node.attach(array_inputs=[rx.just(2), rx.just(4), rx.of(5, 6)])
    await node.drain()
    assert output == 12
