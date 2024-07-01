# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow Library."""

from typing import Any

import networkx as nx
import reactivex as rx

from .constants import default_output
from .errors import (
    GraphHasCyclesError,
    InputNotFoundError,
    NodeAlreadyDefinedError,
    NodeConfigNotDefinedError,
    NodeInputNotDefinedError,
    NodeNotFoundError,
    NodeOutputNotDefinedError,
    OutputAlreadyDefinedError,
    RequiredNodeArrayInputNotFoundError,
    RequiredNodeConfigNotFoundError,
    RequiredNodeInputNotFoundError,
)
from .execution_graph import ExecutionGraph
from .model import Graph, Output, ValRef
from .nodes import ExecutionNode, InputNode, Node
from .registry import Registry


class GraphBuilder:
    """GraphBuilder class.

    This class can be used to iteratively construct a graph by adding nodes and edges, or by ingesting a Graph model directly.
    Once a graph has been built, run the `build` command with the global configuration object to use, and it will return an ExecutionGraph object.
    """

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
        """Add an output to the graph.

        Args:
            name (str): The unique name of the output.
            node (str | None): The node identifier, if None, then the name is the node identifier.
            port (str | none): The node output port.
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
        """Add a node to the graph.

        Args:
            nid: The unique identifier of the node.
            verb: The verb to execute.
            config: The configuration for the verb.
            override: Whether to override the node if it already exists.
        """
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
        """Add an edge to the graph.

        Args:
            from_node: The node to connect from.
            to_node: The node to connect to.
            from_port (str | None): The output port to connect from. If None, then the default output port will be used.
            to_port: The input port to connect to. If None, then this input will be used as an array input.
        """
        if not self._graph.has_node(from_node):
            raise NodeNotFoundError(from_node)
        if not self._graph.has_node(to_node):
            raise NodeNotFoundError(to_node)

        port_connection = {"from_port": from_port, "to_port": to_port}
        if self._graph.has_edge(from_node, to_node):
            edge = self._graph.get_edge_data(from_node, to_node)
            edge["ports"].append(port_connection)
        else:
            self._graph.add_edge(from_node, to_node, ports=[port_connection])

        return self

    def load(self, model: Graph) -> "GraphBuilder":
        """Load a graph model.

        Args:
            model: The graph model to load.
        """
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
        """Build the graph.

        Args:
            inputs: The inputs to the graph.
            config: The global configuration for the graph.
            registry: The registry to use for verb lookup.
        """
        inputs = inputs or {}
        registry = registry or Registry.get_instance()
        config = config or {}

        def build_nodes() -> dict[str, Node]:
            nodes: dict[str, Node] = {}
            for nid in self._graph.nodes:
                node = self._graph.nodes[nid]
                # Check the `input` flag in the nx graph to determine if this is an input node.
                if node.get("input"):
                    nodes[nid] = InputNode(nid)
                    continue

                registration = registry.get(node["verb"])
                node_config = node.get("config", {}) or {}
                for key, value in node_config.items():
                    if isinstance(value, ValRef):
                        if value.reference:
                            node_config[key] = config[value.reference]
                        else:
                            node_config[key] = value.value
                    else:
                        node_config[key] = value

                # Set up an execution node
                verb = registry.get_verb_function(node["verb"])
                node_global_config = {
                    key: value
                    for key, value in config.items()
                    if key in registration.ports.config_names
                }
                node_config = {**node_global_config, **node_config}

                execution_node = ExecutionNode(nid, verb, node_config)
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
                ports = data.get("ports", [])
                for port_connection in ports:
                    from_port = port_connection.get("from_port") or default_output
                    to_port = port_connection.get("to_port")

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

        def bind_inputs(
            nodes: dict[str, Node],
            named_inputs: dict[str, dict[str, rx.Observable[Any]]],
            array_inputs: dict[str, list[rx.Observable[Any]]],
        ):
            for nid in self._graph.nodes:
                node = nodes[nid]
                if isinstance(node, InputNode):
                    node.attach(inputs[nid])
                if isinstance(node, ExecutionNode):
                    named_in = named_inputs.get(nid)
                    array_in = array_inputs.get(nid)
                    node.attach(named_inputs=named_in, array_inputs=array_in)

        def validate_inputs():
            for nid in self._graph.nodes:
                node = self._graph.nodes[nid]
                if node.get("input") and nid not in inputs:
                    raise InputNotFoundError(nid)

        def validate_node_requirements():
            for nid in self._graph.nodes:
                node = self._graph.nodes[nid]

                if node.get("input"):
                    # skip input nodes, they've already been validated
                    continue

                # Validate the inputs and config
                registration = registry.get(node["verb"])
                bindings = registration.ports
                execution_node = nodes[nid]

                if isinstance(execution_node, ExecutionNode):
                    input_names = execution_node.input_names
                    config_names = execution_node.config_names
                    num_array_inputs = execution_node.num_array_inputs
                    output_names = execution_node.output_names
                    array_input = bindings.array_input

                    if (
                        array_input
                        and array_input.required
                        and num_array_inputs < array_input.required
                    ):
                        raise RequiredNodeArrayInputNotFoundError(nid)

                    for required_input in bindings.required_input_names:
                        if required_input not in input_names:
                            raise RequiredNodeInputNotFoundError(nid, required_input)

                    for required_config in bindings.required_config_names:
                        if required_config not in config_names:
                            raise RequiredNodeConfigNotFoundError(nid, required_config)

                    if registration.strict:
                        # Check that all inputs are accounted for
                        for input_name in input_names:
                            if input_name not in bindings.input_names:
                                raise NodeInputNotDefinedError(input_name)

                        for config_name in config_names:
                            if config_name not in bindings.config_names:
                                raise NodeConfigNotDefinedError(config_name)

                        for output_name in output_names:
                            if output_name not in bindings.output_names:
                                raise NodeOutputNotDefinedError(output_name)

        nodes = build_nodes()
        validate_inputs()
        named_inputs, array_inputs = build_node_inputs(nodes)
        bind_inputs(nodes, named_inputs, array_inputs)

        # Validate the graph
        if not nx.is_directed_acyclic_graph(self._graph):
            raise GraphHasCyclesError

        validate_node_requirements()

        return ExecutionGraph(nodes, self._outputs)
