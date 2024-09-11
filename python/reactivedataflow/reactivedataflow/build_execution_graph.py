# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow Library."""

from collections.abc import Callable
from typing import Any

import networkx as nx
import reactivex as rx

from .config_provider import ConfigProvider
from .constants import default_output
from .errors import (
    ConfigReferenceNotFoundError,
    GraphHasCyclesError,
    InputNotFoundError,
    NodeConfigNotDefinedError,
    NodeInputNotDefinedError,
    NodeNotFoundError,
    NodeOutputNotDefinedError,
    RequiredNodeArrayInputNotFoundError,
    RequiredNodeConfigNotFoundError,
    RequiredNodeInputNotFoundError,
)
from .execution_graph import ExecutionGraph
from .model import Graph, Output, ValRef
from .nodes import ExecutionNode, InputNode, Node
from .registry import Registry

ConfigBuilder = Callable[..., Any]


def build_execution_graph(
    model: Graph,
    inputs: dict[str, rx.Observable[Any]] | None = None,
    config_raw: dict[str, Any] | None = None,
    config_providers: dict[str, ConfigProvider[Any]] | None = None,
    config_builders: dict[str, ConfigBuilder] | None = None,
    registry: Registry | None = None,
) -> ExecutionGraph:
    """Build the graph.

    Args:
        model: The graph model.
        inputs: The inputs to the graph.
        config_raw: The global configuration for the graph.
        config_providers: Configuration providers, dict[str, ConfigProvider] (see the ConfigProvider protocol).
        config_builders: Configuration builder functions, dict[str, ConfigBuilder].
        registry: The registry to use for verb lookup.
    """
    graph = _build_nx_graph(model)
    registry = registry or Registry.get_instance()
    inputs = inputs or {}
    config = config_raw or {}
    config_providers = config_providers or {}
    config_builders = config_builders or {}

    for build_spec in model.config.built:
        builder = config_builders[build_spec.builder_name]
        config[build_spec.name] = builder(**build_spec.args)

    def build_nodes() -> dict[str, Node]:
        nodes: dict[str, Node] = {}
        for nid in graph.nodes:
            node = graph.nodes[nid]
            # Check the `input` flag in the nx graph to determine if this is an input node.
            if node.get("input"):
                nodes[nid] = InputNode(nid)
                continue

            registration = registry.get(node["verb"])
            node_config = node.get("config", {}) or {}
            node_config_providers: dict[str, ConfigProvider[Any]] = {}

            for key, value in node_config.items():
                if isinstance(value, ValRef):
                    if value.reference:
                        if value.reference in config:
                            node_config[key] = config[value.reference]
                        elif value.reference in config_providers:
                            node_config_providers[key] = config_providers[
                                value.reference
                            ]
                        else:
                            raise ConfigReferenceNotFoundError(key)
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
            node_global_config_providers = {
                key: value
                for key, value in config_providers.items()
                if key in registration.ports.config_names
            }
            node_config = {**node_global_config, **node_config}
            node_config_providers = {
                **node_global_config_providers,
                **node_config_providers,
            }

            execution_node = ExecutionNode(
                nid, verb, node_config, node_config_providers
            )
            nodes[nid] = execution_node
        return nodes

    def build_node_inputs(
        nodes: dict[str, Node],
    ) -> tuple[
        dict[str, dict[str, rx.Observable[Any]]],
        dict[str, list[rx.Observable[Any]]],
    ]:
        named_inputs: dict[str, dict[str, rx.Observable | list[rx.Observable]]] = {}
        array_inputs: dict[str, list[rx.Observable]] = {}
        for edge in graph.edges(data=True):
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

                    # If this port is already bound, handle a multi-bind
                    existing_binding = named_inputs[to_node].get(to_port)
                    if existing_binding:
                        if isinstance(existing_binding, list):
                            existing_binding.append(input_source)
                        else:
                            named_inputs[to_node][to_port] = [
                                existing_binding,
                                input_source,
                            ]
                    else:
                        named_inputs[to_node][to_port] = input_source
                else:
                    # to_port is not defined, this is an array input
                    if to_node not in array_inputs:
                        array_inputs[to_node] = []
                    array_inputs[to_node].append(input_source)

        resolved_named_inputs: dict[str, dict[str, rx.Observable[Any]]] = {}
        for nid, named_input in named_inputs.items():
            resolved_named_inputs[nid] = {}
            for name, value in named_input.items():
                if isinstance(value, list):
                    resolved_named_inputs[nid][name] = rx.merge(*value)
                else:
                    resolved_named_inputs[nid][name] = value
        return resolved_named_inputs, array_inputs

    def bind_inputs(
        nodes: dict[str, Node],
        named_inputs: dict[str, dict[str, rx.Observable[Any]]],
        array_inputs: dict[str, list[rx.Observable[Any]]],
    ):
        for nid in graph.nodes:
            node = nodes[nid]
            if isinstance(node, InputNode):
                node.attach(inputs[nid])
            if isinstance(node, ExecutionNode):
                named_in = named_inputs.get(nid)
                array_in = array_inputs.get(nid)
                node.attach(named_inputs=named_in, array_inputs=array_in)

    def validate_inputs():
        for nid in graph.nodes:
            node = graph.nodes[nid]
            if node.get("input") and nid not in inputs:
                raise InputNotFoundError(nid)

    def validate_node_requirements():
        for nid in graph.nodes:
            node = graph.nodes[nid]

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
    if not nx.is_directed_acyclic_graph(graph):
        raise GraphHasCyclesError

    validate_node_requirements()

    visit_order = list(nx.topological_sort(graph))

    output_map: dict[str, Output] = {}
    for output in model.outputs:
        if output.node not in nodes:
            raise NodeNotFoundError(output.name)
        output_map[output.name] = output
    return ExecutionGraph(nodes, output_map, visit_order)


def _build_nx_graph(model: Graph) -> nx.DiGraph:
    graph = nx.DiGraph()
    for input_node in model.inputs:
        graph.add_node(input_node.id, input=True)
    for node in model.nodes:
        graph.add_node(node.id, verb=node.verb, config=node.config)
    for edge in model.edges:
        from_node = edge.from_node
        to_node = edge.to_node
        port_connection = {"from_port": edge.from_port, "to_port": edge.to_port}
        if graph.has_edge(from_node, to_node):
            edge = graph.get_edge_data(from_node, to_node)
            edge["ports"].append(port_connection)
        else:
            graph.add_edge(from_node, to_node, ports=[port_connection])
    return graph
