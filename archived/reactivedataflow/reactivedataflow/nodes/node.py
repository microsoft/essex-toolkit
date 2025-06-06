# Copyright (c) 2025 Microsoft Corporation.
"""The reactivedataflow Node Protocol."""

from typing import Any, Protocol

import reactivex as rx

from reactivedataflow.callbacks import Callbacks
from reactivedataflow.constants import default_output


class Node(Protocol):  # pragma: no cover
    """The Node protocol for dynamic processing graphs."""

    @property
    def id(self) -> str:
        """Get the ID of the node."""
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

    def set_callbacks(self, callbacks: Callbacks) -> None:
        """Set the callbacks for the node."""
        ...
