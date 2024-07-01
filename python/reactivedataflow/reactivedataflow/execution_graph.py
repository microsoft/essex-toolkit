# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow Library."""

from typing import Any

import reactivex as rx

from .errors import OutputNotFoundError
from .model import Output
from .nodes.execution_node import Node


class ExecutionGraph:
    """A live execution graph."""

    _nodes: dict[str, Node]
    _outputs: dict[str, Output]
    _order: list[str]

    def __init__(
        self, nodes: dict[str, Node], outputs: dict[str, Output], order: list[str]
    ):
        """Initialize the execution graph.

        Args:
            nodes: The nodes in the graph.
            outputs: The outputs of the graph.
            order: The topological order of the nodes, starting with input nodes.
        """
        self._nodes = nodes
        self._outputs = outputs
        self._order = order

    async def dispose(self) -> None:
        """Dispose of all nodes."""
        for node in self._nodes.values():
            node.detach()
        await self.drain()

    async def drain(self) -> None:
        """Drain the task queue."""
        for node_id in self._order:
            await self._nodes[node_id].drain()

    def output(self, name: str) -> rx.Observable[Any]:
        """Read the output of a node."""
        output = self._outputs.get(name)
        if output is None:
            raise OutputNotFoundError(name)
        node = self._nodes[output.node or output.name]
        return node.output(output.port)

    def output_value(self, name: str) -> rx.Observable[Any]:
        """Read the output of a node."""
        output = self._outputs.get(name)
        if output is None:
            raise OutputNotFoundError(name)
        node = self._nodes[output.node or output.name]
        return node.output_value(output.port)
