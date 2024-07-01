# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Emit Conditions Decorator."""

import logging
from collections.abc import Callable

from reactivedataflow.nodes import (
    EmitCondition,
    VerbFunction,
    VerbInput,
    VerbOutput,
)

_log = logging.getLogger(__name__)


def emit_conditions(
    *conditions: EmitCondition,
) -> Callable[[VerbFunction], VerbFunction]:
    """Conditionally emit to output ports."""

    def wrap_fn(fn: VerbFunction) -> VerbFunction:
        async def wrapped_fn(inputs: VerbInput) -> VerbOutput:
            result = await fn(inputs)
            are_conditions_met = all(
                condition(inputs, result) for condition in conditions
            )
            if not are_conditions_met:
                _log.debug("Emit conditions not met for %s", fn.__qualname__)
                return VerbOutput(no_output=True)

            _log.debug("Emit conditions met for %s", fn.__qualname__)
            return result

        wrapped_fn.__qualname__ = f"{fn.__qualname__}_wrapemitcond"
        return wrapped_fn

    return wrap_fn
