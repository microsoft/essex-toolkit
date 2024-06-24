# Copyright (c) 2024 Microsoft Corporation.
"""A utility function for applying a series of decorators to a function reference."""

from collections.abc import Callable
from functools import reduce
from typing import Any

Decorator = Callable[[Callable[..., Any]], Callable[..., Any]]


def apply_decorators(
    fn: Callable[..., Any], decorators: list[Decorator]
) -> Callable[..., Any]:
    """
    Apply a series of decorators to a function reference.

    This is useful for splitting apart verb registration from the verb implementation.
    """
    return reduce(lambda x, y: y(x), reversed(decorators), fn)
