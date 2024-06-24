# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow InputNode class."""

from typing import Any

import reactivex as rx

from reactivedataflow.constants import default_output
from reactivedataflow.errors import OutputNotDefinedError

from .node import Node


class InputNode(Node):
    """An InputNode class for dynamic processing graphs."""

    _id: str
    _values: rx.subject.BehaviorSubject
    _subscription: rx.abc.DisposableBase | None

    @property
    def id(self) -> str:
        """Get the ID of the node."""
        return self._id

    def __init__(self, nid: str):
        """Initialize the InputNode."""
        self._id = nid
        self._values = rx.subject.BehaviorSubject(None)
        self._subscription = None

    def dispose(self) -> None:
        """Detach the node from all inputs."""
        if self._subscription:
            self._subscription.dispose()

    def attach(self, value: rx.Observable[Any]) -> None:
        """Set the value of a given output."""
        self.dispose()
        self._subscription = value.subscribe(lambda v: self._values.on_next(v))

    def output(self, name: str = default_output) -> rx.Observable[Any]:
        """Get the observable of a given output."""
        if name != default_output:
            raise OutputNotDefinedError(self.id, name)
        return self._values

    def output_value(self, name: str = default_output) -> Any:
        """Get the observable of a given output."""
        if name != default_output:
            raise OutputNotDefinedError(self.id, name)
        return self._values.value
