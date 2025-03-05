# Copyright 2024 Microsoft Corporation.

"""Tests for openai.roles."""

from string import Template

import pytest
from fnllm.openai.roles import OpenAIChatRole
from fnllm.openai.types.aliases import (
    OpenAIChatCompletionMessageToolCallParam,
    OpenAIFunctionCallParam,
    OpenAIFunctionParam,
)


def test_role_messages():
    assert OpenAIChatRole.System.message(
        content="content $some_var", name="name", variables={"some_var": "replaced var"}
    ) == {
        "role": str(OpenAIChatRole.System),
        "content": "content replaced var",
        "name": "name",
    }

    assert OpenAIChatRole.User.message(
        content=Template("content $some_var"),
        name="name",
        variables={"some_var": "replaced var"},
    ) == {
        "role": str(OpenAIChatRole.User),
        "content": "content replaced var",
        "name": "name",
    }

    assert OpenAIChatRole.Assistant.message(
        content="content $some_var",
        name="name",
        tool_calls=[
            OpenAIChatCompletionMessageToolCallParam(
                id="id",
                function=OpenAIFunctionParam(arguments="arguments", name="func_name"),
                type="function",
            )
        ],
        function_call=OpenAIFunctionCallParam(arguments="arguments", name="func_name"),
    ) == {
        "role": str(OpenAIChatRole.Assistant),
        "content": "content $some_var",
        "name": "name",
        "tool_calls": [
            {
                "id": "id",
                "function": {"arguments": "arguments", "name": "func_name"},
                "type": "function",
            }
        ],
        "function_call": {"arguments": "arguments", "name": "func_name"},
    }

    assert OpenAIChatRole.Tool.message(
        content="content $some_var",
        tool_call_id="tool_call_id",
    ) == {
        "role": str(OpenAIChatRole.Tool),
        "content": "content $some_var",
        "tool_call_id": "tool_call_id",
    }

    assert OpenAIChatRole.Function.message(
        content="content",
        name="name",
    ) == {
        "role": str(OpenAIChatRole.Function),
        "content": "content",
        "name": "name",
    }


def test_role_message_with_missing_variables():
    with pytest.raises(KeyError):
        OpenAIChatRole.System.message(content=Template("content $some_var"))


def test_role_message_hash():
    assert hash(OpenAIChatRole.System) == hash("system")
    assert hash(OpenAIChatRole.User) == hash("user")
    assert hash(OpenAIChatRole.Assistant) == hash("assistant")
    assert hash(OpenAIChatRole.Tool) == hash("tool")
    assert hash(OpenAIChatRole.Function) == hash("function")
