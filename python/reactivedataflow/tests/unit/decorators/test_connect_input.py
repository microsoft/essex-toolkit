# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Inputs Decorator Tests."""

from reactivedataflow import (
    ArrayInputPort,
    ConfigPort,
    InputPort,
    VerbInput,
    connect_input,
)


def test_named_input_mapping():
    @connect_input(
        ports=[
            InputPort(name="input_1", parameter="a"),
            InputPort(name="input_2", parameter="b"),
        ]
    )
    def stub(a: int, b: int) -> int:
        return a + b

    result = stub(VerbInput(named_inputs={"input_1": 1, "input_2": 2}))
    assert result == 3


def test_input_with_default_parameter_names():
    @connect_input(
        ports=[
            InputPort(name="a"),
            InputPort(name="b"),
        ]
    )
    def stub(a: int, b: int) -> int:
        return a + b

    result = stub(VerbInput(named_inputs={"a": 1, "b": 2}))
    assert result == 3


def test_input_dict_mapping():
    @connect_input(dict_parameter="inputs")
    def stub(inputs: dict[str, int]) -> int:
        return sum(inputs.values())

    result = stub(VerbInput(named_inputs={"a": 1, "b": 2}))
    assert result == 3


def test_config_parameters_mapping():
    @connect_input(
        ports=[
            ConfigPort(name="in_1", parameter="a"),
            ConfigPort(name="in_2", parameter="b"),
        ]
    )
    def stub(a: str, b: str) -> str:
        return f"{a} {b}"

    result = stub(VerbInput(config={"in_1": "hello", "in_2": "world"}))
    assert result == "hello world"


def test_array_parameter_mapping():
    @connect_input(ports=[ArrayInputPort(parameter="values")])
    def stub(values: list[int]) -> int:
        return sum(values)

    result = stub(VerbInput(array_inputs=[1, 2, 3]))
    assert result == 6
