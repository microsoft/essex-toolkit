# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Verb Decorator."""

from collections.abc import Callable
from typing import Any, ParamSpec

from reactivedataflow.bindings import Binding, Bindings
from reactivedataflow.nodes import (
    EmitCondition,
    FireCondition,
    InputMode,
    OutputMode,
)
from reactivedataflow.registry import Registration, Registry

from .apply_decorators import Decorator

P = ParamSpec("P")


def verb(
    name: str,
    adapters: list[Decorator] | None = None,
    fire_conditions: list[FireCondition] | None = None,
    emit_conditions: list[EmitCondition] | None = None,
    bindings: list[Binding] | None = None,
    registry: Registry | None = None,
    input_mode: InputMode | None = None,
    output_mode: OutputMode | None = None,
    output_names: list[str] | None = None,
    is_async: bool | None = None,
    override: bool | None = None,
) -> Callable[[Callable[P, Any]], Callable[P, Any]]:
    """Register an verb function with the given name."""
    registry = registry or Registry.get_instance()

    def wrap_fn(verb: Callable[P, Any]) -> Callable[P, Any]:
        registration = Registration(
            fn=verb,
            bindings=Bindings(bindings or []),
            fire_conditions=fire_conditions or [],
            emit_conditions=emit_conditions or [],
            adapters=adapters or [],
            is_async=is_async or False,
            input_mode=input_mode or InputMode.PortMapped,
            output_mode=output_mode or OutputMode.Value,
            output_names=output_names,
        )
        registry.register(
            name,
            registration,
            override=override,
        )
        return verb

    return wrap_fn
