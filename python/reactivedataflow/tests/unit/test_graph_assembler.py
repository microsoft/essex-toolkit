# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Graph Assembler Tests."""

import pytest
import reactivex as rx

from reactivedataflow import (
    GraphBuilder,
    Registry,
)
from reactivedataflow.constants import default_output
from reactivedataflow.errors import NodeIdAlreadyExistsError, OutputNotDefinedError
from reactivedataflow.model import Edge, Graph, InputNode, Node

from .define_math_ops import define_math_ops


def test_double_add_node_raises_error():
    registry = Registry()
    define_math_ops(registry)

    assembler = GraphBuilder().add_node("c1", "constant", config={"value": 1})
    with pytest.raises(NodeIdAlreadyExistsError):
        assembler.add_node("c1", "constant", config={"value": 2})
    assembler.add_node("c1", "constant", config={"value": 2}, override=True)
    graph = assembler.build(registry=registry)
    assert graph.output_value("c1", default_output) == 2


def test_input_bind():
    registry = Registry()

    graph = (
        GraphBuilder()
        .add_input("i1")
        .build(registry=registry, inputs={"i1": rx.just(1)})
    )
    assert graph.output_value("i1", default_output) == 1


def test_simple_graph():
    registry = Registry()
    define_math_ops(registry)

    graph = (
        GraphBuilder()
        .add_node("c1", "constant", config={"value": 1})
        .build(registry=registry)
    )
    assert graph.output_value("c1", default_output) == 1


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
        .build(registry=registry)
    )

    assert graph.output_value("c1", default_output) == 1
    assert graph.output_value("c3", default_output) == 3
    assert graph.output_value("n1") == 4

    # Check subscribe output is working
    value = None

    def set_value(v):
        nonlocal value
        value = v

    graph.output("n1").subscribe(set_value)
    assert value == 4


def test_input_node():
    registry = Registry()
    assembler = GraphBuilder()
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
        .build(registry=registry)
    )

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

    assembler = GraphBuilder()
    assembler.load(
        Graph(
            inputs=[
                InputNode(id="i1"),
            ],
            nodes=[
                Node(id="c3", verb="constant", config={"value": 3}),
                Node(id="c5", verb="constant", config={"value": 5}),
                Node(id="n1", verb="add"),
                Node(id="n2", verb="add"),
                Node(id="n3", verb="multiply"),
            ],
            edges=[
                # First sum inputs: 1 + 3 = 4
                Edge(from_node="i1", to_node="n1"),
                Edge(from_node="c3", to_node="n1"),
                # Second sum inputs: 5 + 3 = 8
                Edge(from_node="c3", to_node="n2"),
                Edge(from_node="c5", to_node="n2"),
                # Multiply the sums: 4 * 8 = 32
                Edge(from_node="n1", to_node="n3", to_port="a"),
                Edge(from_node="n2", to_node="n3", to_port="b"),
            ],
        )
    )

    # Build the graph
    graph = assembler.build(registry=registry, inputs={"i1": rx.just(1)})
    assert graph.output_value("n3") == 32
