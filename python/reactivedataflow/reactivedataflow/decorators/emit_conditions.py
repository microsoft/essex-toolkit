# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Emit Conditions Decorator."""

from collections.abc import Callable

from reactivedataflow.nodes import (
    EmitCondition,
    VerbFunction,
    VerbInput,
    VerbOutput,
)


def emit_conditions(
    *conditions: EmitCondition,
) -> Callable[[VerbFunction], VerbFunction]:
    """Conditionally emit to output ports."""

    def wrap_fn(fn: VerbFunction) -> VerbFunction:
        def wrapped_fn(inputs: VerbInput) -> VerbOutput:
            result = fn(inputs)
            are_conditions_met = all(
                condition(inputs, result) for condition in conditions
            )
            if not are_conditions_met:
                return VerbOutput(no_output=True)

            return result

        wrapped_fn.__qualname__ = f"{fn.__qualname__}_wrapemitcond"
        return wrapped_fn

    return wrap_fn
