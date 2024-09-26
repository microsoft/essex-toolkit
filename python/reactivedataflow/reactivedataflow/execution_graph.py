# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow Library."""

from typing import Any

import reactivex as rx

from .errors import OutputNotFoundError
from .model import Output
from .nodes.execution_node import Node, OnNodeFinishCallback, OnNodeStartCallback


class ExecutionGraph:
    """A live execution graph."""

    _nodes: dict[str, Node]
    _outputs: dict[str, Output]
    _order: list[str]
    _on_node_start: OnNodeStartCallback
    _on_node_finish: OnNodeFinishCallback

    def __init__(
        self,
        nodes: dict[str, Node],
        outputs: dict[str, Output],
        order: list[str],
        on_node_start: OnNodeStartCallback | None = None,
        on_node_finish: OnNodeFinishCallback | None = None,
    ):
        """Initialize the execution graph.

        Args:
            nodes: The nodes in the graph.
            outputs: The outputs of the graph.
            order: The topological order of the nodes, starting with input nodes.
            on_node_start: The callback for when a node starts.
            on_node_finish: The callback for when a node finishes
        """
        self._nodes = nodes
        self._outputs = outputs
        self._order = order
        self._on_node_start = on_node_start or (lambda _node_id, _verb: None)
        self._on_node_finish = on_node_finish or (lambda _node_id, _verb, _timing: None)

        for node in self._nodes.values():
            node.on_start(self._on_node_start)
            node.on_finish(self._on_node_finish)

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
