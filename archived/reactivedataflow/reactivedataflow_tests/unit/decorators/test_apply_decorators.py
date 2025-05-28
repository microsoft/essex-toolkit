# Copyright (c) 2025 Microsoft Corporation.
"""Tests for the apply_decorators function."""

from collections.abc import Callable
from functools import wraps

from reactivedataflow import apply_decorators


def test_apply_decorators() -> None:
    def append_a(func: Callable):
        @wraps(func)
        def with_logging(*args, **kwargs):
            print(f"Calling {func.__name__}")
            return func(*args, **kwargs) + "A"

        return with_logging

    def append_b(func: Callable):
        @wraps(func)
        def with_logging(*args, **kwargs):
            print(f"Calling {func.__name__}")
            return func(*args, **kwargs) + "B"

        return with_logging

    def append_c(func: Callable):
        @wraps(func)
        def with_logging(*args, **kwargs):
            print(f"Calling {func.__name__}")
            return func(*args, **kwargs) + "C"

        return with_logging

    def stub():
        return ""

    decorated = apply_decorators(stub, [append_a, append_b, append_c])
    assert decorated() == "CBA"


def test_apply_decorators_no_decorators() -> None:
    def stub():
        return ""

    decorated = apply_decorators(stub, [])
    assert decorated() == ""
    assert decorated is stub
