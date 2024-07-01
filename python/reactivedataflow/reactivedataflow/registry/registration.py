# Copyright (c) 2024 Microsoft Corporation.
"""Registration of a verb function."""

from collections.abc import Callable
from dataclasses import dataclass

from reactivedataflow.decorators import Decorator
from reactivedataflow.nodes import (
    EmitCondition,
    FireCondition,
    InputMode,
    OutputMode,
)
from reactivedataflow.ports import Ports


@dataclass
class Registration:
    """Registration of an verb function."""

    fn: Callable
    """The verb function."""

    ports: Ports
    """The ports of the verb function."""

    adapters: list[Decorator]
    """A list of decorators to apply to the raw verb function."""

    fire_conditions: list[FireCondition]
    emit_conditions: list[EmitCondition]
    input_mode: InputMode
    output_mode: OutputMode
    output_names: list[str] | None
    strict: bool
