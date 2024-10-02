# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Outputs Decorator."""

from collections.abc import Awaitable, Callable
from inspect import iscoroutine
from typing import Any, ParamSpec, TypeVar

from reactivedataflow.nodes import (
    VerbOutput,
)

P = ParamSpec("P")
T = TypeVar("T")


def handle_async_output() -> (
    Callable[[Callable[P, Any]], Callable[P, Awaitable[VerbOutput]]]
):
    """Unroll async output.

    Args:
        default_output (bool): The default output of the function.
    """

    def wrap_fn(fn: Callable[P, Any]) -> Callable[P, Awaitable[VerbOutput]]:
        async def wrapped_fn(*args: P.args, **kwargs: P.kwargs) -> VerbOutput:
            result = fn(*args, **kwargs)
            if iscoroutine(result):
                return await result
            return result

        wrapped_fn.__qualname__ = f"{fn.__qualname__}_wrapasync"
        return wrapped_fn

    return wrap_fn
