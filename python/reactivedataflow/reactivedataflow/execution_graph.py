# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow Library."""

from typing import Any

import reactivex as rx

from reactivedataflow.constants import default_output

from .nodes.execution_node import Node


class ExecutionGraph:
    """A live execution graph."""

    _nodes: dict[str, Node]

    def __init__(self, nodes: dict[str, Node]):
        self._nodes = nodes

    def dispose(self) -> None:
        """Dispose of all nodes."""
        for node in self._nodes.values():
            node.dispose()

    def output(self, nid: str, port: str = default_output) -> rx.Observable[Any]:
        """Read the output of a node."""
        node = self._nodes[nid]
        return node.output(port)

    def output_value(self, nid: str, port: str = default_output) -> rx.Observable[Any]:
        """Read the output of a node."""
        node = self._nodes[nid]
        return node.output_value(port)
