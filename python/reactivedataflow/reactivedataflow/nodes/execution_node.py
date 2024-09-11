# Copyright (c) 2024 Microsoft Corporation.
"""The reactivedataflow ExecutionNode class."""

import asyncio
import logging
from typing import Any

import reactivex as rx

from reactivedataflow.config_provider import ConfigProvider
from reactivedataflow.constants import default_output

from .definitions import VerbFunction
from .io import VerbInput
from .node import Node

_log = logging.getLogger(__name__)


class ExecutionNode(Node):
    """The ExecutionNode class for dynamic processing graphs."""

    _id: str
    _fn: VerbFunction
    _config: dict[str, Any]
    _config_providers: dict[str, ConfigProvider[Any]]

    # Input Observables
    _named_inputs: dict[str, rx.Observable]
    _named_input_values: dict[str, Any]
    _array_inputs: list[rx.Observable]
    _array_input_values: list[Any]
    _subscriptions: list[rx.abc.DisposableBase]

    # Output Observable
    _outputs: dict[str, rx.subject.BehaviorSubject]
    _tasks: list

    def __init__(
        self,
        nid: str,
        fn: VerbFunction,
        config: dict[str, Any] | None = None,
        config_providers: dict[str, ConfigProvider[Any]] | None = None,
    ):
        """Initialize the ExecutionNode.

        Args:
            nid (str): The node identifier.
            fn (VerbFunction): The execution logic for the function. The input is a dictionary of input names to their latest values.
            config (dict[str, Any], optional): The configuration for the node. Defaults to None.
            config_providers (dict[str, ConfigProvider[Any]], optional): The configuration providers for the node. Defaults to None.
        """
        self._id = nid
        self._fn = fn
        self._config = config or {}
        self._config_providers = config_providers or {}
        # Inputs
        self._named_inputs = {}
        self._named_input_values = {}
        self._array_inputs = []
        self._array_input_values = []
        self._subscriptions = []
        # Output
        self._outputs = {}
        self._tasks = []
        # fire a recompute
        self._schedule_recompute("init")

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
        self._schedule_recompute("config")

    def output(self, name: str = default_output) -> rx.Observable[Any]:
        """Get the observable of a given output."""
        return self._output(name)

    def output_value(self, name: str = default_output) -> Any:
        """Get the observable of a given output."""
        return self._output(name).value

    async def drain(self) -> None:
        """Drain the tasks."""
        if len(self._tasks) > 0:
            await asyncio.gather(*self._tasks)

    def detach(self) -> None:
        """Detach the node from all inputs."""
        if len(self._subscriptions) > 0:
            for subscription in self._subscriptions:
                subscription.dispose()
            self._subscriptions = []

    @property
    def input_names(self) -> set[str]:
        """Get the names of the inputs."""
        return set(self._named_inputs.keys())

    @property
    def config_names(self) -> set[str]:
        """Get the names of the config."""
        return set(self._config.keys())

    @property
    def output_names(self) -> set[str]:
        """Get the names of the outputs."""
        return set(self._outputs.keys())

    @property
    def num_array_inputs(self) -> int:
        """Get the number of array inputs."""
        return len(self._array_inputs)

    def attach(
        self,
        named_inputs: dict[str, rx.Observable[Any]] | None = None,
        array_inputs: list[rx.Observable[Any]] | None = None,
    ) -> None:
        """Connect an observable to an input of the node."""

        def on_named_value(value: Any, name: str) -> None:
            self._named_input_values[name] = value
            self._schedule_recompute(f"input: {name}")

        def on_array_value(value: Any, i: int) -> None:
            self._array_input_values[i] = value
            self._schedule_recompute(f"array_value@{i}")

        # Detach from inputs
        self.detach()

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

    def _schedule_recompute(self, cause: str | None) -> None:
        _log.debug(f"recompute scheduled for {self._id} due to {cause or 'unknown'}")

        # Generate a shallow copy of the inputs and configuration
        previous_output = {name: obs.value for name, obs in self._outputs.items()}
        named_inputs = self._named_input_values.copy()
        array_inputs = self._array_input_values.copy()
        config = self._config.copy()
        for name, provider in self._config_providers.items():
            value = provider.get()
            _log.debug("inject config from provider %s, value=%s", name, value)
            config[name] = value

        inputs = VerbInput(
            config=config,
            named_inputs=named_inputs,
            array_inputs=array_inputs,
            previous_output=previous_output,
        )
        task = asyncio.create_task(self._recompute(inputs))
        task.add_done_callback(lambda _: self._tasks.remove(task))
        self._tasks.append(task)

    async def _recompute(self, inputs: VerbInput) -> None:
        """Recompute the node."""
        result = await self._fn(inputs)
        if not result.no_output:
            for name, value in result.outputs.items():
                self._output(name).on_next(value)
