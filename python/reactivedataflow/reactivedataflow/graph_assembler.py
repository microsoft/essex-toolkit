# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow Library."""

from typing import Any

import networkx as nx
import reactivex as rx

from reactivedataflow.errors import NodeIdAlreadyExistsError

from .execution_graph import ExecutionGraph
from .graph_model import GraphModel, InputModel
from .nodes import ExecutionNode, InputNode, Node
from .registry import Registry


class GraphAssembler:
    """GraphAssembler class."""

    _graph: nx.DiGraph

    def __init__(self):
        """Initialize the GraphAssembler."""
        self._graph = nx.DiGraph()

    def add_input(self, nid: str) -> None:
        """Add an input node to the graph."""
        self._graph.add_node(nid, input=True)

    def add_node(
        self,
        nid: str,
        verb: str,
        config: dict[str, Any] | None = None,
        named_inputs: dict[str, InputModel] | None = None,
        array_inputs: list[InputModel] | None = None,
        override: bool = False,
    ) -> None:
        """Add a node to the graph."""
        if self._graph.has_node(nid) and not override:
            raise NodeIdAlreadyExistsError(nid)

        self._graph.add_node(nid, verb=verb, config=config)
        if named_inputs:
            for input_name, input_source in named_inputs.items():
                self._add_edge(
                    from_node=input_source.node,
                    from_port=input_source.port,
                    to_node=nid,
                    to_port=input_name,
                )
        if array_inputs:
            for input_source in array_inputs:
                self._add_edge(
                    from_node=input_source.node,
                    from_port=input_source.port,
                    to_node=nid,
                )

    def _add_edge(
        self, from_node: str, from_port: str, to_node: str, to_port: str | None = None
    ):
        """Add an edge to the graph."""
        self._graph.add_edge(from_node, to_node, from_port=from_port, to_port=to_port)

    def load(self, model: GraphModel) -> None:
        """Load a graph model."""
        for node in model.inputs:
            self.add_input(node.id)
        for node in model.nodes:
            self.add_node(
                node.id,
                node.verb,
                config=node.config,
                named_inputs=node.input,
                array_inputs=node.array_input,
            )

    def build(
        self,
        inputs: dict[str, rx.Observable[Any]] | None = None,
        config: dict[str, Any] | None = None,
        registry: Registry | None = None,
    ) -> ExecutionGraph:
        """Build the graph."""
        inputs = inputs or {}
        registry = registry or Registry.get_instance()
        config = config or {}

        def build_nodes() -> dict[str, Node]:
            nodes: dict[str, Node] = {}
            for nid in self._graph.nodes:
                node = self._graph.nodes[nid]
                node_config = node.get("config", {}) or {}
                if node.get("input"):
                    nodes[nid] = InputNode(nid)
                    continue

                verb = registry.get(node["verb"]).fn
                node_final_config = {**config, **node_config}
                execution_node = ExecutionNode(nid, verb, node_final_config)
                nodes[nid] = execution_node
            return nodes

        def build_node_inputs(
            inputs: dict[str, rx.Observable], nodes: dict[str, Node]
        ) -> tuple[
            dict[str, dict[str, rx.Observable[Any]]],
            dict[str, list[rx.Observable[Any]]],
        ]:
            named_inputs: dict[str, dict[str, rx.Observable]] = {}
            array_inputs: dict[str, list[rx.Observable]] = {}
            for edge in self._graph.edges(data=True):
                from_node, to_node, data = edge
                from_port = data["from_port"]
                to_port = data.get("to_port")
                input_source = (
                    inputs[from_node]
                    if from_node in inputs
                    else nodes[from_node].output(from_port)
                )

                if to_port:
                    if to_node not in named_inputs:
                        named_inputs[to_node] = {}
                    named_inputs[to_node][to_port] = input_source
                else:
                    if to_node not in array_inputs:
                        array_inputs[to_node] = []
                    array_inputs[to_node].append(input_source)
            return named_inputs, array_inputs

        nodes = build_nodes()
        named_inputs, array_inputs = build_node_inputs(inputs, nodes)

        # Bind the Inputs
        for nid in self._graph.nodes:
            node = nodes[nid]
            if isinstance(node, InputNode):
                node.attach(inputs[nid])
            if isinstance(node, ExecutionNode):
                named_in = named_inputs.get(nid)
                array_in = array_inputs.get(nid)
                node.attach(named_inputs=named_in, array_inputs=array_in)

        return ExecutionGraph(nodes)
