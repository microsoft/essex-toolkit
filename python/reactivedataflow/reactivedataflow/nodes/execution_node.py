# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow ExecutionNode class."""

from typing import Any

import reactivex as rx

from reactivedataflow.constants import default_output

from .io import VerbInput
from .node import Node
from .types import VerbFunction


class ExecutionNode(Node):
    """The ExecutionNode class for dynamic processing graphs."""

    _id: str
    _fn: VerbFunction
    _config: dict[str, Any]

    # Input Observables
    _named_inputs: dict[str, rx.Observable]
    _named_input_values: dict[str, Any]
    _array_inputs: list[rx.Observable]
    _array_input_values: list[Any]
    _subscriptions: list[rx.abc.DisposableBase]

    # Output Observable
    _outputs: dict[str, rx.subject.BehaviorSubject]

    def __init__(
        self,
        nid: str,
        fn: VerbFunction,
        config: dict[str, Any] | None = None,
    ):
        """Initialize the ExecutionNode.

        Args:
            fn (VerbFunction): The execution logic for the function. The input is a dictionary of input names to their latest values.
        """
        self._id = nid
        self._fn = fn
        self._config = config or {}
        # Inputs
        self._named_inputs = {}
        self._named_input_values = {}
        self._array_inputs = []
        self._array_input_values = []
        self._subscriptions = []
        # Output
        self._outputs = {}
        # fire a recompute
        self._recompute()

    def _output(self, name: str) -> rx.subject.BehaviorSubject:
        """Get the subject of a given output."""
        if name not in self._outputs:
            self._outputs[name] = rx.subject.BehaviorSubject(None)
        return self._outputs[name]

    @property
    def id(self) -> str:
        """Get the ID of the node."""
        return self._id

    @property
    def config(self) -> dict[str, Any]:
        """Get the configuration of the node."""
        return self._config

    @config.setter
    def config(self, value: dict[str, Any]) -> None:
        """Set the configuration of the node."""
        self._config = value
        self._recompute()

    def output(self, name: str = default_output) -> rx.Observable[Any]:
        """Get the observable of a given output."""
        return self._output(name)

    def output_value(self, name: str = default_output) -> Any:
        """Get the observable of a given output."""
        return self._output(name).value

    def dispose(self) -> None:
        """Detach the node from all inputs."""
        if len(self._subscriptions) > 0:
            for subscription in self._subscriptions:
                subscription.dispose()
            self._subscriptions = []

    def attach(
        self,
        named_inputs: dict[str, rx.Observable[Any]] | None = None,
        array_inputs: list[rx.Observable[Any]] | None = None,
    ) -> None:
        """Connect an observable to an input of the node."""

        def on_named_value(value: Any, name: str) -> None:
            self._named_input_values[name] = value
            self._recompute()

        def on_array_value(value: Any, i: int) -> None:
            self._array_input_values[i] = value
            self._recompute()

        # Detach from inputs
        self.dispose()

        if named_inputs:
            for name, source in named_inputs.items():
                self._named_inputs[name] = source
                self._named_input_values[name] = None
                sub = source.subscribe(lambda v, name=name: on_named_value(v, name))
                self._subscriptions.append(sub)
        if array_inputs:
            self._array_inputs = array_inputs
            self._array_input_values = [None] * len(array_inputs)
            for i, source in enumerate(array_inputs):
                sub = source.subscribe(lambda v, i=i: on_array_value(v, i))
                self._subscriptions.append(sub)

    def _recompute(self) -> None:
        inputs = VerbInput(
            config=self._config,
            named_inputs=self._named_input_values,
            array_inputs=self._array_input_values,
            previous_output={name: obs.value for name, obs in self._outputs.items()},
        )

        result = self._fn(inputs)
        if not result.no_output:
            for name, value in result.outputs.items():
                self._output(name).on_next(value)
