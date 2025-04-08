# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Firing Conditions Decorator."""

import logging
from collections.abc import Callable

from reactivedataflow.nodes import FireCondition, VerbFunction, VerbInput, VerbOutput

_log = logging.getLogger(__name__)


def fire_conditions(
    *conditions: FireCondition,
) -> Callable[[VerbFunction], VerbFunction]:
    """Apply conditional firing conditions to a function."""

    def wrap_fn(fn: VerbFunction) -> VerbFunction:
        async def wrapped_fn(inputs: VerbInput) -> VerbOutput:
            are_conditions_met = all(condition(inputs) for condition in conditions)
            if not are_conditions_met:
                _log.debug("Firing conditions not met for %s", fn.__qualname__)
                return VerbOutput(no_output=True)

            _log.debug("Firing conditions met for %s", fn.__qualname__)
            return await fn(inputs)

        wrapped_fn.__qualname__ = f"{fn.__qualname__}_wrapfirecond"
        return wrapped_fn

    return wrap_fn
