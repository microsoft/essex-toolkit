# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Graph Assembler Tests."""

from typing import Annotated

from reactivedataflow import (
    ArrayInput,
    Config,
    Input,
    Registry,
    verb,
)
from reactivedataflow.conditions import (
    array_input_not_empty,
)


def define_math_ops(registry: Registry) -> None:
    @verb(
        name="add",
        registry=registry,
        fire_conditions=[array_input_not_empty()],
    )
    def add(values: Annotated[list[int], ArrayInput()]) -> int:
        return sum(values)

    @verb(
        name="multiply",
        registry=registry,
    )
    def multiply(a: Annotated[int, Input()], b: Annotated[int, Input()]) -> int:
        return a * b

    @verb(
        name="constant",
        registry=registry,
    )
    def constant(value: Annotated[int, Config()]) -> int:
        return value
