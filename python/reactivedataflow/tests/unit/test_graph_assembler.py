# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Graph Assembler Tests."""

import pytest
import reactivex as rx

from reactivedataflow import (
    GraphAssembler,
    GraphModel,
    InputModel,
    InputNodeModel,
    Registry,
    VerbNodeModel,
    verb,
)
from reactivedataflow.conditions import (
    array_input_not_empty,
)
from reactivedataflow.constants import default_output
from reactivedataflow.errors import NodeIdAlreadyExistsError, OutputNotDefinedError
from reactivedataflow.ports import ArrayInputPort, ConfigPort, InputPort


def define_math_ops(registry: Registry):
    @verb(
        name="add",
        registry=registry,
        ports=[ArrayInputPort(required=True, parameter="values")],
        fire_conditions=[array_input_not_empty()],
    )
    def add(values: list[int]) -> int:
        return sum(values)

    @verb(
        name="multiply",
        registry=registry,
        ports=[
            InputPort(name="a", required=True),
            InputPort(name="b", required=True),
        ],
    )
    def multiply(a: int, b: int) -> int:
        return a * b

    @verb(
        name="constant",
        registry=registry,
        ports=[ConfigPort(name="value", required=True)],
    )
    def constant(value: int) -> int:
        return value


def test_double_add_node_raises_error():
    registry = Registry()
    define_math_ops(registry)

    assembler = GraphAssembler()
    assembler.add_node("c1", "constant", config={"value": 1})
    with pytest.raises(NodeIdAlreadyExistsError):
        assembler.add_node("c1", "constant", config={"value": 2})
    assembler.add_node("c1", "constant", config={"value": 2}, override=True)
    graph = assembler.build(registry=registry)
    assert graph.output_value("c1", default_output) == 2


def test_input_bind():
    registry = Registry()

    assembler = GraphAssembler()
    assembler.add_input("i1")
    graph = assembler.build(registry=registry, inputs={"i1": rx.just(1)})
    assert graph.output_value("i1", default_output) == 1


def test_simple_graph():
    registry = Registry()
    define_math_ops(registry)

    assembler = GraphAssembler()
    assembler.add_node("c1", "constant", config={"value": 1})
    graph = assembler.build(registry=registry)
    assert graph.output_value("c1", default_output) == 1


def test_math_op_graph():
    registry = Registry()
    define_math_ops(registry)

    assembler = GraphAssembler()
    assembler.add_node("c1", "constant", config={"value": 1})
    assembler.add_node("c3", "constant", config={"value": 3})
    assembler.add_node(
        "n1",
        "add",
        array_inputs=[
            InputModel(node="c1", port=default_output),
            InputModel(node="c3"),
        ],
    )

    graph = assembler.build(registry=registry)
    assert graph.output_value("n1", default_output) == 4

    # Check subscribe output is working
    value = None

    def set_value(v):
        nonlocal value
        value = v

    graph.output("n1", default_output).subscribe(set_value)
    assert value == 4


def test_input_node():
    registry = Registry()
    assembler = GraphAssembler()
    assembler.add_input("i")

    subject = rx.subject.BehaviorSubject(1)
    graph = assembler.build(registry=registry, inputs={"i": subject})

    with pytest.raises(OutputNotDefinedError):
        graph.output_value("i", "x")
    with pytest.raises(OutputNotDefinedError):
        graph.output("i", "x")

    outsub = graph.output("i")
    value: int | None = None

    def set_value(v):
        nonlocal value
        value = v

    outsub.subscribe(set_value)

    assert graph.output_value("i", default_output) == 1
    assert value == 1

    subject.on_next(2)
    assert graph.output_value("i", default_output) == 2
    assert value == 2
    graph.dispose()


def test_graph_assembler():
    registry = Registry()
    define_math_ops(registry)

    # Assemble a graph:
    #
    #  n1 ----\
    #         n3
    #  n2 ----/
    #
    assembler = GraphAssembler()
    # Define Input Layer
    assembler.add_node("c1", "constant", config={"value": 1})
    assembler.add_node("c3", "constant", config={"value": 3})
    assembler.add_node("c5", "constant", config={"value": 5})

    # Define Execution Layer
    assembler.add_node(
        "n1",
        "add",
        array_inputs=[
            InputModel(node="c1"),
            InputModel(node="c3"),
        ],
    )
    assembler.add_node(
        "n2",
        "add",
        array_inputs=[
            InputModel(node="c5"),
            InputModel(node="c3"),
        ],
    )

    assembler.add_node(
        "n3",
        "multiply",
        named_inputs={
            "a": InputModel(node="n1"),
            "b": InputModel(node="n2"),
        },
    )

    # Build the graph
    graph = assembler.build(registry=registry)
    assert graph.output_value("c1", default_output) == 1
    assert graph.output_value("c3", default_output) == 3
    assert graph.output_value("c5", default_output) == 5
    assert graph.output_value("n1", default_output) == 4
    assert graph.output_value("n2", default_output) == 8
    assert graph.output_value("n3", default_output) == 32
    graph.dispose()


def test_graph_assembler_from_schema():
    registry = Registry()
    define_math_ops(registry)

    assembler = GraphAssembler()
    assembler.load(
        GraphModel(
            inputs=[
                InputNodeModel(id="i1"),
            ],
            nodes=[
                VerbNodeModel(id="c3", verb="constant", config={"value": 3}),
                VerbNodeModel(id="c5", verb="constant", config={"value": 5}),
                VerbNodeModel(
                    id="n1",
                    verb="add",
                    array_input=[
                        InputModel(node="i1"),
                        InputModel(node="c3"),
                    ],
                ),
                VerbNodeModel(
                    id="n2",
                    verb="add",
                    array_input=[
                        InputModel(node="c5"),
                        InputModel(node="c3"),
                    ],
                ),
                VerbNodeModel(
                    id="n3",
                    verb="multiply",
                    input={
                        "a": InputModel(node="n1"),
                        "b": InputModel(node="n2"),
                    },
                ),
            ],
        )
    )

    # Build the graph
    graph = assembler.build(registry=registry, inputs={"i1": rx.just(1)})
    assert graph.output_value("i1", default_output) == 1
    assert graph.output_value("c3", default_output) == 3
    assert graph.output_value("c5", default_output) == 5
    assert graph.output_value("n1", default_output) == 4
    assert graph.output_value("n2", default_output) == 8
    assert graph.output_value("n3", default_output) == 32
