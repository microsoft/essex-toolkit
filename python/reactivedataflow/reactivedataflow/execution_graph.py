# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow Library."""

import asyncio
from typing import Any

import reactivex as rx

from .errors import OutputNotFoundError
from .model import Output
from .nodes.execution_node import Node


class ExecutionGraph:
    """A live execution graph."""

    _nodes: dict[str, Node]
    _outputs: dict[str, Output]

    def __init__(self, nodes: dict[str, Node], outputs: dict[str, Output]):
        """Initialize the execution graph.

        Args:
            nodes: The nodes in the graph.
            outputs: The outputs of the graph.
        """
        self._nodes = nodes
        self._outputs = outputs

    async def dispose(self) -> None:
        """Dispose of all nodes."""
        for node in self._nodes.values():
            node.detach()
        await self.drain()

    async def drain(self) -> None:
        """Drain the task queue."""
        drains = [node.drain() for node in self._nodes.values()]
        if len(drains) > 0:
            await asyncio.gather(*drains)

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
