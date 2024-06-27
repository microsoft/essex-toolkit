# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow Library."""

from typing import Any

import networkx as nx
import reactivex as rx

from .constants import default_output
from .errors import (
    NodeAlreadyDefinedError,
    NodeNotFoundError,
    OutputAlreadyDefinedError,
)
from .execution_graph import ExecutionGraph
from .model import Graph, Output
from .nodes import ExecutionNode, InputNode, Node
from .registry import Registry


class GraphBuilder:
    """GraphBuilder class."""

    _graph: nx.DiGraph
    _outputs: dict[str, Output]

    def __init__(self):
        """Initialize the GraphBuilder."""
        self._graph = nx.DiGraph()
        self._outputs = {}

    def add_input(self, nid: str) -> "GraphBuilder":
        """Add an input node to the graph."""
        self._graph.add_node(nid, input=True)
        return self

    def add_output(
        self, name: str, node: str | None = None, port: str = default_output
    ) -> "GraphBuilder":
        """
        Add an output to the graph.

        ---
        name: The unique name of the output.
        node: The node identifier, if None, then the name is the node identifier.
        port: The node output port.
        """
        if node is None:
            node = name
        if name in self._outputs:
            raise OutputAlreadyDefinedError(name)

        self._outputs[name] = Output(name=name, node=node, port=port)
        return self

    def add_node(
        self,
        nid: str,
        verb: str,
        config: dict[str, Any] | None = None,
        override: bool = False,
    ) -> "GraphBuilder":
        """Add a node to the graph."""
        if self._graph.has_node(nid) and not override:
            raise NodeAlreadyDefinedError(nid)
        self._graph.add_node(nid, verb=verb, config=config)
        return self

    def add_edge(
        self,
        from_node: str,
        to_node: str,
        from_port: str | None = None,
        to_port: str | None = None,
    ) -> "GraphBuilder":
        """
        Add an edge to the graph.

        If from_port is None, then the default output port will be used.
        If to_port is None, then this input will be used as an array input.
        """
        if not self._graph.has_node(from_node):
            raise NodeNotFoundError(from_node)
        if not self._graph.has_node(to_node):
            raise NodeNotFoundError(to_node)
        self._graph.add_edge(from_node, to_node, from_port=from_port, to_port=to_port)
        return self

    def load(self, model: Graph) -> "GraphBuilder":
        """Load a graph model."""
        for node in model.inputs:
            self.add_input(node.id)
        for output in model.outputs:
            self.add_output(output.name, output.node, output.port)
        for node in model.nodes:
            self.add_node(
                node.id,
                node.verb,
                config=node.config,
            )
        for edge in model.edges:
            self.add_edge(
                from_node=edge.from_node,
                from_port=edge.from_port,
                to_node=edge.to_node,
                to_port=edge.to_port,
            )
        return self

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

                # Check the `input` flag in the nx graph to determine if this is an input node.
                if node.get("input"):
                    nodes[nid] = InputNode(nid)
                    continue

                # Set up an execution node
                verb = registry.get_verb_function(node["verb"])
                node_final_config = {**config, **node_config}
                execution_node = ExecutionNode(nid, verb, node_final_config)
                nodes[nid] = execution_node
            return nodes

        def build_node_inputs(
            nodes: dict[str, Node],
        ) -> tuple[
            dict[str, dict[str, rx.Observable[Any]]],
            dict[str, list[rx.Observable[Any]]],
        ]:
            named_inputs: dict[str, dict[str, rx.Observable]] = {}
            array_inputs: dict[str, list[rx.Observable]] = {}
            for edge in self._graph.edges(data=True):
                # Unpack the edge details
                from_node, to_node, data = edge
                from_port = data.get("from_port") or default_output
                to_port = data.get("to_port")

                # Find the appropriate observable the "from" side of the edge represents.
                input_source = (
                    inputs[from_node]
                    if from_node in inputs
                    else nodes[from_node].output(from_port)
                )

                if to_port:
                    # to_port is defined, this is a named input
                    if to_node not in named_inputs:
                        named_inputs[to_node] = {}
                    named_inputs[to_node][to_port] = input_source
                else:
                    # to_port is not defined, this is an array input
                    if to_node not in array_inputs:
                        array_inputs[to_node] = []
                    array_inputs[to_node].append(input_source)
            return named_inputs, array_inputs

        nodes = build_nodes()
        named_inputs, array_inputs = build_node_inputs(nodes)

        # Bind the Inputs
        for nid in self._graph.nodes:
            node = nodes[nid]
            if isinstance(node, InputNode):
                node.attach(inputs[nid])
            if isinstance(node, ExecutionNode):
                named_in = named_inputs.get(nid)
                array_in = array_inputs.get(nid)
                node.attach(named_inputs=named_in, array_inputs=array_in)

        return ExecutionGraph(nodes, self._outputs)
