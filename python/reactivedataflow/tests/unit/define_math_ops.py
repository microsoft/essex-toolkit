# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Graph Assembler Tests."""

from reactivedataflow import (
    Registry,
    verb,
)
from reactivedataflow.bindings import ArrayInput, Config, Input
from reactivedataflow.conditions import (
    array_input_not_empty,
)


def define_math_ops(registry: Registry) -> None:
    @verb(
        name="add",
        registry=registry,
        bindings=[ArrayInput(required=True, parameter="values")],
        fire_conditions=[array_input_not_empty()],
    )
    def add(values: list[int]) -> int:
        return sum(values)

    @verb(
        name="multiply",
        registry=registry,
        bindings=[
            Input(name="a", required=True),
            Input(name="b", required=True),
        ],
    )
    def multiply(a: int, b: int) -> int:
        return a * b

    @verb(
        name="constant",
        registry=registry,
        bindings=[Config(name="value", required=True)],
    )
    def constant(value: int) -> int:
        return value
