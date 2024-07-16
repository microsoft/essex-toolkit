# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Verb Decorator."""

import inspect
from collections.abc import Callable
from typing import Any, ParamSpec

from reactivedataflow.nodes import (
    EmitCondition,
    FireCondition,
    InputMode,
    OutputMode,
)
from reactivedataflow.ports import (
    ArrayInput,
    Config,
    Input,
    NamedInputs,
    Output,
    PortBinding,
    Ports,
)
from reactivedataflow.registry import Registration, Registry

from .apply_decorators import Decorator

P = ParamSpec("P")


def verb(
    name: str,
    adapters: list[Decorator] | None = None,
    fire_conditions: list[FireCondition] | None = None,
    emit_conditions: list[EmitCondition] | None = None,
    ports: list[PortBinding] | None = None,
    registry: Registry | None = None,
    input_mode: InputMode | None = None,
    output_mode: OutputMode | None = None,
    output_names: list[str] | None = None,
    override: bool | None = None,
    include_default_output: bool | None = None,
    strict: bool | None = None,
) -> Callable[[Callable[P, Any]], Callable[P, Any]]:
    """Register an verb function with the given name.

    Args:
        name (str): The name of the verb.
        adapters (list[Decorator] | None): A list of decorators to apply to the verb before any other decoration.
        fire_conditions (list[FireCondition] | None): A list of fire conditions.
        emit_conditions (list[EmitCondition] | None): A list of emit conditions.
        ports (list[PortBinding] | None): A list of port bindings, which are used to inject config, input, and map output values.
        registry (Registry | None): The registry to register the verb with. If None, then the default registry will be used.
        input_mode (InputMode | None): The input mode of the verb. If raw, then the function is expected to adhere to the VerbFunction interface.
        output_mode (OutputMode | None): The output mode of the verb, either a single-value or tuple.
        output_names (list[str] | None): The names of the outputs in tuple output mode.
        override (bool | None): Whether to override the verb if it already exists.
        strict (bool | None): Whether to enforce strict port names. If True, then errors wil be raised at graph-building time if any inputs to this node don't align with the defined input bindings, or any mapped outputs don't align to the defined outputs list.
        include_default_output (bool | None): Whether to include a default output port, default=True.
    """
    registry = registry or Registry.get_instance()

    def wrap_fn(verb: Callable[P, Any]) -> Callable[P, Any]:
        ports_array = ports or []
        for parameter_name, parameter in inspect.signature(verb).parameters.items():
            annotation = parameter.annotation
            if annotation and hasattr(annotation, "__metadata__"):
                annotations = list(annotation.__metadata__)
                for meta in annotations:
                    if isinstance(meta, PortBinding):
                        meta = meta.model_copy()
                        if not isinstance(meta, Output):
                            meta.parameter = parameter_name
                        if isinstance(meta, (Input, Config)):
                            meta.name = meta.name or parameter_name
                        if isinstance(meta, (Input, Config, ArrayInput, NamedInputs)):
                            meta.required = (
                                meta.required
                                or parameter.default is inspect.Parameter.empty
                            )
                        ports_array.append(meta)

        registration = Registration(
            fn=verb,
            ports=Ports(
                ports_array,
                include_default_output if include_default_output is not None else True,
            ),
            fire_conditions=fire_conditions or [],
            emit_conditions=emit_conditions or [],
            adapters=adapters or [],
            strict=strict or False,
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
