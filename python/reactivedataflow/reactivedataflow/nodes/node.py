# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow Node Protocol."""

from typing import Any, Protocol

import reactivex as rx

from reactivedataflow.constants import default_output


class Node(Protocol):
    """The Node protocol for dynamic processing graphs."""

    @property
    def id(self) -> str:
        """Get the ID of the node."""
        ...

    def dispose(self) -> None:
        """Detach the node from all inputs."""
        ...

    def output(self, name: str = default_output) -> rx.Observable[Any]:
        """Get the observable of a given output."""
        ...

    def output_value(self, name: str = default_output) -> Any:
        """Get the observable of a given output."""
        ...
