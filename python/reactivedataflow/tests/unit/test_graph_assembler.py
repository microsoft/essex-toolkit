# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Graph Assembler Tests."""

import pytest
import reactivex as rx

from reactivedataflow import (
    GraphAssembler,
    Registry,
)
from reactivedataflow.constants import default_output
from reactivedataflow.errors import NodeIdAlreadyExistsError, OutputNotDefinedError
from reactivedataflow.model import (
    Graph,
    Input,
    InputNode,
    ProcessingNode,
)

from .define_math_ops import define_math_ops


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
            Input(node="c1", port=default_output),
            Input(node="c3"),
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
            Input(node="c1"),
            Input(node="c3"),
        ],
    )
    assembler.add_node(
        "n2",
        "add",
        array_inputs=[
            Input(node="c5"),
            Input(node="c3"),
        ],
    )

    assembler.add_node(
        "n3",
        "multiply",
        named_inputs={
            "a": Input(node="n1"),
            "b": Input(node="n2"),
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
        Graph(
            inputs=[
                InputNode(id="i1"),
            ],
            nodes=[
                ProcessingNode(id="c3", verb="constant", config={"value": 3}),
                ProcessingNode(id="c5", verb="constant", config={"value": 5}),
                ProcessingNode(
                    id="n1",
                    verb="add",
                    array_input=[
                        Input(node="i1"),
                        Input(node="c3"),
                    ],
                ),
                ProcessingNode(
                    id="n2",
                    verb="add",
                    array_input=[
                        Input(node="c5"),
                        Input(node="c3"),
                    ],
                ),
                ProcessingNode(
                    id="n3",
                    verb="multiply",
                    input={
                        "a": Input(node="n1"),
                        "b": Input(node="n2"),
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
