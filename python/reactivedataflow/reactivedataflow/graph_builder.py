# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow Library."""

from collections.abc import Callable
from typing import Any

import reactivex as rx

from .build_execution_graph import build_execution_graph
from .config_provider import ConfigProvider
from .constants import default_output
from .errors import (
    MissingConfigurationError,
    NodeAlreadyDefinedError,
    NodeNotFoundError,
    OutputAlreadyDefinedError,
    UnexpectedConfigurationError,
)
from .execution_graph import ExecutionGraph
from .model import Config, ConfigSpec, Edge, Graph, InputNode, Node, Output, ValRef
from .registry import Registry

ConfigBuilder = Callable[..., Any]


class GraphBuilder:
    """GraphBuilder class.

    This class can be used to iteratively construct a graph model by adding nodes, edges, inputs, outputs, and configuration.
    This graph can then be constructed into an execution graph using the `build_execution_graph` function.
    """

    _inputs: dict[str, InputNode]
    _outputs: dict[str, Output]
    _nodes: dict[str, Node]
    _edges: list[Edge]
    _config: Config

    def __init__(self):
        """Initialize the GraphBuilder."""
        self._inputs = {}
        self._outputs = {}
        self._nodes = {}
        self._edges = []
        self._config = Config()

    def add_input(self, nid: str) -> "GraphBuilder":
        """Add an input node to the graph."""
        self._inputs[nid] = InputNode(id=nid)
        return self

    def add_raw_config(self, config: dict[str, Any]) -> "GraphBuilder":
        """Add raw configuration to the graph."""
        self._config.raw = {**self._config.raw, **config}
        return self

    def add_built_config(self, *config: ConfigSpec) -> "GraphBuilder":
        """Add built configuration to the graph."""
        self._config.built = [*self._config.built, *list(config)]
        return self

    def add_injected_config(self, *config: str) -> "GraphBuilder":
        """Add injected configuration to the graph."""
        self._config.injected = [*self._config.injected, *list(config)]
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
        if node not in self._nodes and node not in self._inputs:
            raise NodeNotFoundError(node)

        self._outputs[name] = Output(name=name, node=node, port=port)
        return self

    def add_node(
        self,
        nid: str,
        verb: str,
        config: dict[str, str | int | float | bool | ValRef] | None = None,
        override: bool = False,
    ) -> "GraphBuilder":
        """Add a node to the graph.

        Args:
            nid: The unique identifier of the node.
            verb: The verb to execute.
            config: The configuration for the verb.
            override: Whether to override the node if it already exists.
        """
        if nid in self._nodes and not override:
            raise NodeAlreadyDefinedError(nid)
        self._nodes[nid] = Node(id=nid, verb=verb, config=config or {})
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
        if from_node not in self._nodes and from_node not in self._inputs:
            raise NodeNotFoundError(from_node)
        if to_node not in self._nodes:
            raise NodeNotFoundError(to_node)

        self._edges.append(
            Edge(
                from_node=from_node,
                to_node=to_node,
                from_port=from_port or default_output,
                to_port=to_port,
            )
        )
        return self

    def load_model(self, model: Graph) -> "GraphBuilder":
        """Load a model into the builder."""
        self._config = model.config
        self._inputs = {node.id: node for node in model.inputs}
        self._outputs = {output.name: output for output in model.outputs}
        self._nodes = {node.id: node for node in model.nodes}
        for edge in model.edges:
            self.add_edge(edge.from_node, edge.to_node, edge.from_port, edge.to_port)
        return self

    def build_model(
        self,
    ) -> Graph:
        """Build the graph model instance."""
        return Graph(
            inputs=list(self._inputs.values()),
            outputs=list(self._outputs.values()),
            nodes=list(self._nodes.values()),
            edges=self._edges,
            config=self._config,
        )

    def build(
        self,
        inputs: dict[str, rx.Observable[Any]] | None = None,
        config_raw: dict[str, Any] | None = None,
        config_providers: dict[str, ConfigProvider[Any]] | None = None,
        config_builders: dict[str, ConfigBuilder] | None = None,
        registry: Registry | None = None,
    ) -> ExecutionGraph:
        """Build the execution graph.

        Args:
            inputs: The inputs to the graph.
            config_raw: The global configuration for the graph.
            config_providers: Configuration providers, dict[str, ConfigProvider] (see the ConfigProvider protocol).
            config_builders: Configuration builder functions, dict[str, ConfigBuilder].
            registry: The registry to use for verb lookup.
        """
        config_raw = config_raw or {}
        config_providers = config_providers or {}
        expected_keys = set(self._config.injected)
        injected_keys: set[str] = set()

        for key in config_raw:
            if key not in self._config.injected:
                raise UnexpectedConfigurationError(key)
            injected_keys.add(key)
        for key in config_providers:
            if key not in self._config.injected:
                raise UnexpectedConfigurationError(key)
            injected_keys.add(key)

        if injected_keys != expected_keys:
            raise MissingConfigurationError(expected_keys - injected_keys)

        return build_execution_graph(
            self.build_model(),
            inputs=inputs,
            config_raw={**self._config.raw, **config_raw},
            config_providers=config_providers,
            config_builders=config_builders,
            registry=registry,
        )
