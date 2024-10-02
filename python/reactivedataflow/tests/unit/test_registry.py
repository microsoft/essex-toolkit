# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Verb Registry Tests."""

from typing import TYPE_CHECKING

import pytest
from reactivedataflow import OutputMode, VerbInput, VerbOutput, verb
from reactivedataflow.errors import VerbAlreadyDefinedError, VerbNotFoundError
from reactivedataflow.registry import Registry

if TYPE_CHECKING:
    from collections.abc import Callable


def test_throws_on_double_register():
    registry = Registry()

    @verb(name="test_fn", registry=registry, output_mode=OutputMode.Raw)
    def test_fn(inputs: VerbInput) -> VerbOutput:
        return VerbOutput(no_output=True)

    def double_register():
        @verb(name="test_fn", registry=registry, output_mode=OutputMode.Raw)
        def test_fn2(inputs: VerbInput) -> VerbOutput:
            return VerbOutput(no_output=True)

    with pytest.raises(VerbAlreadyDefinedError):
        double_register()


def test_register_override():
    registry = Registry()

    @verb(name="test_fn", registry=registry, output_mode=OutputMode.Raw)
    def test_fn(inputs: VerbInput) -> VerbOutput:
        return VerbOutput(no_output=True)

    e2: Callable | None = None

    def double_register():
        nonlocal e2

        @verb(
            name="test_fn",
            registry=registry,
            override=True,
            output_mode=OutputMode.Raw,
        )
        def test_fn2(inputs: VerbInput) -> VerbOutput:
            return VerbOutput(no_output=True)

        e2 = test_fn2

    double_register()
    found = registry.get("test_fn")
    assert found.fn == e2


def test_static_registry_instance():
    registry = Registry.get_instance()
    registry2 = Registry.get_instance()
    assert registry == registry2


def test_child():
    registry = Registry()

    @verb(name="test_fn", registry=registry, output_mode=OutputMode.Raw)
    def test_fn(inputs: VerbInput) -> VerbOutput:
        return VerbOutput(no_output=True)

    clone = registry.clone()
    assert clone.get("test_fn") == registry.get("test_fn")

    @verb(name="test_fn2", registry=clone, output_mode=OutputMode.Raw)
    def test_fn2(inputs: VerbInput) -> VerbOutput:
        return VerbOutput(no_output=True)

    assert clone.get("test_fn2") is not None
    with pytest.raises(VerbNotFoundError):
        registry.get("test_fn2")
