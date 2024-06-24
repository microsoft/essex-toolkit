# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Outputs Decorator."""

import asyncio
from collections.abc import Callable
from typing import Any, ParamSpec, TypeVar

from reactivedataflow.nodes import (
    VerbOutput,
)

P = ParamSpec("P")
T = TypeVar("T")


def handle_async_output() -> Callable[[Callable[P, Any]], Callable[P, VerbOutput]]:
    """Unroll async output.

    Args:
        default_output (bool): The default output of the function.
    """

    def wrap_fn(fn: Callable[P, Any]) -> Callable[P, VerbOutput]:
        def wrapped_fn(*args: P.args, **kwargs: P.kwargs) -> VerbOutput:
            result = fn(*args, **kwargs)
            return asyncio.run(result)

        wrapped_fn.__qualname__ = f"{fn.__qualname__}_wrapasync"
        return wrapped_fn

    return wrap_fn
