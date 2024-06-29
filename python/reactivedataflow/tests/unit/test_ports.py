# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow PortMap tests."""

import pytest

from reactivedataflow.errors import PortNamesMustBeUniqueError
from reactivedataflow.ports import (
    ArrayInput,
    Config,
    Input,
    Output,
    Ports,
)


def test_port_map_can_separate_port_types() -> None:
    ports = Ports([
        Input(name="value", type="str"),
        Config(name="value", type="str"),
        Output(name="output", type="str"),
        ArrayInput(type="str"),
    ])
    assert len(ports.input) == 1
    assert len(ports.config) == 1
    assert len(ports.outputs) == 1
    assert ports.array_input is not None


def test_port_map_throws_on_duplicate_input_ports() -> None:
    with pytest.raises(PortNamesMustBeUniqueError):
        Ports([
            Input(name="input", type="str"),
            Input(name="input", type="str"),
        ])


def test_port_map_throws_on_duplicate_config_ports() -> None:
    with pytest.raises(PortNamesMustBeUniqueError):
        Ports([
            Config(name="input", type="str"),
            Config(name="input", type="str"),
        ])
