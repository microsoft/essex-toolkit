# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow PortMap tests."""

import pytest

from reactivedataflow.errors import PortNamesMustBeUniqueError
from reactivedataflow.ports import (
    ArrayInputPort,
    ConfigPort,
    InputPort,
    OutputPort,
    Ports,
)


def test_port_map_can_separate_port_types() -> None:
    ports = Ports([
        InputPort(name="value", type="str"),
        ConfigPort(name="value", type="str"),
        OutputPort(name="output", type="str"),
        ArrayInputPort(type="str"),
    ])
    assert len(ports.input) == 1
    assert len(ports.config) == 1
    assert len(ports.outputs) == 1
    assert ports.array_input is not None


def test_port_map_throws_on_duplicate_input_ports() -> None:
    with pytest.raises(PortNamesMustBeUniqueError):
        Ports([
            InputPort(name="input", type="str"),
            InputPort(name="input", type="str"),
        ])


def test_port_map_throws_on_duplicate_config_ports() -> None:
    with pytest.raises(PortNamesMustBeUniqueError):
        Ports([
            ConfigPort(name="input", type="str"),
            ConfigPort(name="input", type="str"),
        ])
