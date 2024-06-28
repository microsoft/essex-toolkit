# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Graph Builder Tests."""

import pytest
import reactivex as rx

from reactivedataflow import (
    GraphBuilder,
    Registry,
    verb,NamedInputs
)
from reactivedataflow.errors import (
    InputNotFoundError,
    NodeAlreadyDefinedError,
    NodeNotFoundError,
    OutputAlreadyDefinedError,
    OutputNotFoundError,
    RequiredNodeConfigNotFoundError,
    RequiredNodeInputNotFoundError,
    RequiredNodeArrayInputNotFoundError,
)
from reactivedataflow.model import Edge, Graph, InputNode, Node, Output

from .define_math_ops import define_math_ops


def test_missing_input_raises_error():
    builder = GraphBuilder()
    builder.add_input("i1")

    with pytest.raises(InputNotFoundError):
        builder.build()


def test_missing_node_input_raises_error():
    registry = Registry()
    define_math_ops(registry)

    builder = GraphBuilder()
    builder.add_node("n", "multiply")

    with pytest.raises(RequiredNodeInputNotFoundError):
        builder.build(registry=registry)

    builder.add_node("const1", "constant", config={"value": 1})
    builder.add_edge(from_node="const1", to_node="n", to_port="a")

    with pytest.raises(RequiredNodeInputNotFoundError):
        builder.build(registry=registry)

    builder.add_node("const2", "constant", config={"value": 2})
    builder.add_edge(from_node="const2", to_node="n", to_port="b")
    builder.add_output("n")

    graph = builder.build(registry=registry)
    assert graph.output_value("n") == 2

def test_missing_array_input_raises_error():
    registry = Registry()
    define_math_ops(registry)

    builder = GraphBuilder()
    builder.add_node("const1", "constant", config={"value": 1})
    builder.add_node("n", "add")
    builder.add_output("n")

    with pytest.raises(RequiredNodeArrayInputNotFoundError):
        builder.build(registry=registry)

    builder.add_edge(from_node="const1", to_node="n")
    graph = builder.build(registry=registry)
    assert graph.output_value("n") == 1


def test_missing_dict_input_raises_error():
    registry = Registry()
    define_math_ops(registry)
    @verb(
        name="add_dict",
        registry=registry,
        bindings=[
            NamedInputs(required=["a"], parameter="values")
        ])
    def add(values: dict[str, int]) -> int:
        return sum(values.values())

    builder = GraphBuilder()
    builder.add_node("const1", "constant", config={"value": 1})
    builder.add_node("n", "add_dict")
    builder.add_output("n")

    with pytest.raises(RequiredNodeInputNotFoundError):
        builder.build(registry=registry)

    builder.add_edge(from_node="const1", to_node="n", to_port="a")
    graph = builder.build(registry=registry)
    assert graph.output_value("n") == 1


def test_missing_node_config_raises_error():
    registry = Registry()
    define_math_ops(registry)

    builder = GraphBuilder()
    builder.add_node("n", "constant")

    with pytest.raises(RequiredNodeConfigNotFoundError):
        builder.build(registry=registry)

    builder = GraphBuilder()
    builder.add_node("n", "constant", config={"value": 1})
    builder.add_output("n")

    graph = builder.build(registry=registry)
    assert graph.output_value("n") == 1


def test_double_add_node_raises_error():
    registry = Registry()
    define_math_ops(registry)

    builder = GraphBuilder().add_node("c1", "constant", config={"value": 1})
    with pytest.raises(NodeAlreadyDefinedError):
        builder.add_node("c1", "constant", config={"value": 2})
    builder.add_node("c1", "constant", config={"value": 2}, override=True)
    builder.add_output("c1")
    graph = builder.build(registry=registry)

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


def test_throws_on_redundant_output():
    builder = GraphBuilder().add_input("i1").add_output("i1")
    with pytest.raises(OutputAlreadyDefinedError):
        builder.add_output("i1")


def test_throws_on_add_edge_with_unknown_nodes():
    builder = GraphBuilder()
    builder.add_node("n1", "add")
    with pytest.raises(NodeNotFoundError):
        builder.add_edge(from_node="n1", to_node="n2")
    with pytest.raises(NodeNotFoundError):
        builder.add_edge(from_node="n2", to_node="n1")


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
    builder = GraphBuilder()
    builder.add_input("i").add_output("i").add_output("fail_1", "i", "x")

    subject = rx.subject.BehaviorSubject(1)
    graph = builder.build(registry=registry, inputs={"i": subject})

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


def test_graph_builder():
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


def test_graph_builder_from_schema():
    registry = Registry()
    define_math_ops(registry)

    builder = GraphBuilder()
    builder.load(
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
    graph = builder.build(registry=registry, inputs={"input": input_stream})

    with pytest.raises(OutputNotFoundError):
        graph.output_value("fail_1")
    with pytest.raises(OutputNotFoundError):
        graph.output("fail_1")
    assert graph.output_value("result") == 32
    input_stream.on_next(2)
    assert graph.output_value("result") == 40
