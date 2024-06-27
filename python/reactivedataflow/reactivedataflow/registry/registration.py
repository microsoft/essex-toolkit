# Copyright (c) 2024 Microsoft Corporation.
"""Registration of a verb function."""

from collections.abc import Callable
from dataclasses import dataclass

from reactivedataflow.bindings import Bindings
from reactivedataflow.decorators import Decorator
from reactivedataflow.nodes import (
    EmitCondition,
    FireCondition,
    InputMode,
    OutputMode,
)


@dataclass
class Registration:
    """Registration of an verb function."""

    fn: Callable
    """The verb function."""

    bindings: Bindings
    """The ports of the verb function."""

    adapters: list[Decorator]
    """A list of decorators to apply to the raw verb function."""

    fire_conditions: list[FireCondition]
    emit_conditions: list[EmitCondition]
    input_mode: InputMode
    output_mode: OutputMode
    output_names: list[str] | None
    is_async: bool
