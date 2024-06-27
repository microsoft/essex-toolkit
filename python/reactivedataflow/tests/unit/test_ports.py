# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow PortMap tests."""

import pytest

from reactivedataflow.bindings import (
    ArrayInputBinding,
    Bindings,
    ConfigBinding,
    InputBinding,
    OutputBinding,
)
from reactivedataflow.errors import PortNamesMustBeUniqueError


def test_port_map_can_separate_port_types() -> None:
    ports = Bindings([
        InputBinding(name="value", type="str"),
        ConfigBinding(name="value", type="str"),
        OutputBinding(name="output", type="str"),
        ArrayInputBinding(type="str"),
    ])
    assert len(ports.input) == 1
    assert len(ports.config) == 1
    assert len(ports.outputs) == 1
    assert ports.array_input is not None


def test_port_map_throws_on_duplicate_input_ports() -> None:
    with pytest.raises(PortNamesMustBeUniqueError):
        Bindings([
            InputBinding(name="input", type="str"),
            InputBinding(name="input", type="str"),
        ])


def test_port_map_throws_on_duplicate_config_ports() -> None:
    with pytest.raises(PortNamesMustBeUniqueError):
        Bindings([
            ConfigBinding(name="input", type="str"),
            ConfigBinding(name="input", type="str"),
        ])
