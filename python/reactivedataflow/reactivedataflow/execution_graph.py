# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow Library."""

from typing import Any

import reactivex as rx

from .errors import OutputNotDefinedError
from .model import Output
from .nodes.execution_node import Node


class ExecutionGraph:
    """A live execution graph."""

    _nodes: dict[str, Node]
    _outputs: dict[str, Output]

    def __init__(self, nodes: dict[str, Node], outputs: dict[str, Output]):
        self._nodes = nodes
        self._outputs = outputs

    def dispose(self) -> None:
        """Dispose of all nodes."""
        for node in self._nodes.values():
            node.dispose()

    def output(self, name: str) -> rx.Observable[Any]:
        """Read the output of a node."""
        output = self._outputs.get(name)
        if output is None:
            raise OutputNotDefinedError(name)
        node = self._nodes[output.node]
        return node.output(output.port)

    def output_value(self, name: str) -> rx.Observable[Any]:
        """Read the output of a node."""
        output = self._outputs.get(name)
        if output is None:
            raise OutputNotDefinedError(name)
        node = self._nodes[output.node]
        return node.output_value(output.port)
