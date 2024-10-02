# Copyright (c) 2024 Microsoft Corporation.

"""Tests for llm.features.variables_replacing."""

import pytest
from fnllm.services.variable_injector import VariableInjector


def test_variables_are_properly_replaced():
    injector = VariableInjector()

    # empty variables dict
    result = injector.inject_variables("prompt without variables", variables={})
    assert result == "prompt without variables"

    # should replace
    result = injector.inject_variables(
        "prompt with variables $var_1 $var_2",
        variables={"var_1": "Variable 1", "var_2": "Variable 2"},
    )
    assert result == "prompt with variables Variable 1 Variable 2"

    # extra variable
    result = injector.inject_variables(
        "prompt with variables $var_1",
        variables={"var_1": "Variable 1", "extra": "extra"},
    )
    assert result == "prompt with variables Variable 1"


def test_missing_variable_should_raise():
    injector = VariableInjector()

    # call the LLM
    with pytest.raises(KeyError):
        injector.inject_variables(
            "prompt with variables $var_1 $var_2",
            variables={"var_1": "Variable 1"},
        )
