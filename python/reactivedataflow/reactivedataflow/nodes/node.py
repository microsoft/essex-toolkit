# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow Node Protocol."""

from typing import Any, Protocol

import reactivex as rx

from reactivedataflow.constants import default_output

from .definitions import OnNodeFinishCallback, OnNodeStartCallback, Unsubscribe


class Node(Protocol):
    """The Node protocol for dynamic processing graphs."""

    @property
    def id(self) -> str:
        """Get the ID of the node."""
        ...

    @property
    def verb(self) -> str:
        """Get the verb name of the node."""
        ...

    def detach(self) -> None:
        """Detach the node from all inputs."""
        ...

    async def drain(self) -> None:
        """Wait for the node to finish processing."""
        ...

    def output(self, name: str = default_output) -> rx.Observable[Any]:
        """Get the observable of a given output."""
        ...

    def output_value(self, name: str = default_output) -> Any:
        """Get the observable of a given output."""
        ...

    def on_start(self, callback: OnNodeStartCallback) -> Unsubscribe:
        """Subscribe to events for when the node begins execution."""
        ...

    def on_finish(self, callback: OnNodeFinishCallback) -> Unsubscribe:
        """Subscribe to events for when the node finishes execution."""
        ...
