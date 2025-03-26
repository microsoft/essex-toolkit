# Copyright (c) 2024 Microsoft Corporation.
"""A utility function for applying a series of decorators to a function reference."""

from collections.abc import Callable
from functools import reduce
from typing import Any

AnyFn = Callable[..., Any]
Decorator = Callable[[AnyFn], AnyFn]


def apply_decorators(fn: AnyFn, decorators: list[Decorator]) -> AnyFn:
    """Apply a series of decorators to a function reference.

    This is useful for splitting apart verb registration from the verb implementation.

    Args:
        fn: The function to decorate.
        decorators: The decorators to apply. These will be applied in reverse order so that they can be copied/pasted from a decorated function.
    """
    return reduce(lambda x, y: y(x), reversed(decorators), fn)
