# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Graph Assembler Tests."""

import pytest
import reactivex as rx

from reactivedataflow import (
    GraphBuilder,
    Registry,
)
from reactivedataflow.errors import NodeAlreadyDefinedError, OutputNotFoundError
from reactivedataflow.model import Edge, Graph, InputNode, Node, Output

from .define_math_ops import define_math_ops


def test_double_add_node_raises_error():
    registry = Registry()
    define_math_ops(registry)

    assembler = GraphBuilder().add_node("c1", "constant", config={"value": 1})
    with pytest.raises(NodeAlreadyDefinedError):
        assembler.add_node("c1", "constant", config={"value": 2})
    assembler.add_node("c1", "constant", config={"value": 2}, override=True)
    assembler.add_output("c1")
    graph = assembler.build(registry=registry)

    assert graph.output_value("c1") == 2


def test_input_bind():
    registry = Registry()

    graph = (
        GraphBuilder()
        .add_input("i1")
        .add_output("i1")
        .build(registry=registry, inputs={"i1": rx.just(1)})
    )
    assert graph.output_value("i1") == 1


def test_simple_graph():
    registry = Registry()
    define_math_ops(registry)

    graph = (
        GraphBuilder()
        .add_node("c1", "constant", config={"value": 1})
        .add_output("c1")
        .build(registry=registry)
    )
    assert graph.output_value("c1") == 1


def test_math_op_graph():
    registry = Registry()
    define_math_ops(registry)

    graph = (
        GraphBuilder()
        .add_node("c1", "constant", config={"value": 1})
        .add_node("c3", "constant", config={"value": 3})
        .add_node("n1", "add")
        .add_edge(from_node="c1", to_node="n1")
        .add_edge(from_node="c3", to_node="n1")
        .add_output("constant1", "c1")
        .add_output("constant3", "c3")
        .add_output("add1", "n1")
        .build(registry=registry)
    )

    assert graph.output_value("constant1") == 1
    assert graph.output_value("constant3") == 3
    assert graph.output_value("add1") == 4

    # Check subscribe output is working
    value = None

    def set_value(v):
        nonlocal value
        value = v

    graph.output("add1").subscribe(set_value)
    assert value == 4


def test_input_node():
    registry = Registry()
    assembler = GraphBuilder()
    assembler.add_input("i").add_output("i").add_output("fail_1", "i", "x")

    subject = rx.subject.BehaviorSubject(1)
    graph = assembler.build(registry=registry, inputs={"i": subject})

    with pytest.raises(OutputNotFoundError):
        graph.output_value("fail_1")
    with pytest.raises(OutputNotFoundError):
        graph.output("fail_1")

    outsub = graph.output("i")
    value: int | None = None

    def set_value(v):
        nonlocal value
        value = v

    outsub.subscribe(set_value)

    assert graph.output_value("i") == 1
    assert value == 1

    subject.on_next(2)
    assert graph.output_value("i") == 2
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
    graph = (
        GraphBuilder()
        # Define Input Layer
        .add_node("c1", "constant", config={"value": 1})
        .add_node("c3", "constant", config={"value": 3})
        .add_node("c5", "constant", config={"value": 5})
        # Define Execution Layer
        .add_node("n1", "add")
        .add_edge(from_node="c1", to_node="n1")
        .add_edge(from_node="c3", to_node="n1")
        .add_node("n2", "add")
        .add_edge(from_node="c3", to_node="n2")
        .add_edge(from_node="c5", to_node="n2")
        .add_node("n3", "multiply")
        .add_edge(from_node="n1", to_node="n3", to_port="a")
        .add_edge(from_node="n2", to_node="n3", to_port="b")
        .add_output("result", "n3")
        .build(registry=registry)
    )
    assert graph.output_value("result") == 32
    graph.dispose()


def test_graph_assembler_from_schema():
    registry = Registry()
    define_math_ops(registry)

    assembler = GraphBuilder()
    assembler.load(
        Graph(
            inputs=[
                InputNode(id="input"),
            ],
            nodes=[
                Node(id="c3", verb="constant", config={"value": 3}),
                Node(id="c5", verb="constant", config={"value": 5}),
                Node(id="first_add", verb="add"),
                Node(id="second_add", verb="add"),
                Node(id="product", verb="multiply"),
            ],
            edges=[
                # First sum inputs: 1 + 3 = 4
                Edge(from_node="input", to_node="first_add"),
                Edge(from_node="c3", to_node="first_add"),
                # Second sum inputs: 5 + 3 = 8
                Edge(from_node="c3", to_node="second_add"),
                Edge(from_node="c5", to_node="second_add"),
                # Multiply the sums: 4 * 8 = 32
                Edge(from_node="first_add", to_node="product", to_port="a"),
                Edge(from_node="second_add", to_node="product", to_port="b"),
            ],
            outputs=[Output(name="result", node="product")],
        )
    )

    # Build the graph
    input_stream = rx.subject.BehaviorSubject(1)
    graph = assembler.build(registry=registry, inputs={"input": input_stream})
    assert graph.output_value("result") == 32
    input_stream.on_next(2)
    assert graph.output_value("result") == 40
