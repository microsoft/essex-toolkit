# Copyright 2024 Microsoft Corporation.

"""Tests for openai.llm.utils."""

from fnllm.openai.llm.utils import (
    chat_completion_message_to_param,
    function_call_to_param,
    function_to_param,
    tool_calls_to_params,
)
from fnllm.openai.types.aliases import (
    OpenAIChatCompletionAssistantMessageParam,
    OpenAIChatCompletionMessageModel,
    OpenAIChatCompletionMessageToolCallModel,
    OpenAIChatCompletionMessageToolCallParam,
    OpenAIFunctionCallModel,
    OpenAIFunctionCallParam,
    OpenAIFunctionModel,
    OpenAIFunctionParam,
)


def test_function_call_to_param():
    data = OpenAIFunctionCallModel(arguments="arguments", name="name")

    assert function_call_to_param(data) == OpenAIFunctionCallParam(
        arguments="arguments", name="name"
    )
    assert function_call_to_param(None) is None


def test_function_to_param():
    data = OpenAIFunctionModel(arguments="arguments", name="name")

    assert function_to_param(data) == OpenAIFunctionParam(
        arguments="arguments", name="name"
    )


def test_tool_calls_to_params():
    data = [
        OpenAIChatCompletionMessageToolCallModel(
            id="id",
            function=OpenAIFunctionModel(arguments="arguments", name="name"),
            type="function",
        )
    ]

    assert tool_calls_to_params(data) == [
        OpenAIChatCompletionMessageToolCallParam(
            id="id",
            function=OpenAIFunctionParam(arguments="arguments", name="name"),
            type="function",
        )
    ]
    assert tool_calls_to_params(None) is None


def test_chat_completion_message_to_param():
    data = OpenAIChatCompletionMessageModel(
        content="content",
        role="assistant",
        function_call=OpenAIFunctionCallModel(arguments="arguments", name="name"),
        tool_calls=[
            OpenAIChatCompletionMessageToolCallModel(
                id="tool_id",
                function=OpenAIFunctionModel(arguments="arguments2", name="name2"),
                type="function",
            )
        ],
    )
    data_no_tools_no_func = OpenAIChatCompletionMessageModel(
        content="content",
        role="assistant",
    )

    assert chat_completion_message_to_param(
        data
    ) == OpenAIChatCompletionAssistantMessageParam(
        content="content",
        role="assistant",
        function_call=OpenAIFunctionCallParam(arguments="arguments", name="name"),
        tool_calls=[
            OpenAIChatCompletionMessageToolCallParam(
                id="tool_id",
                function=OpenAIFunctionParam(arguments="arguments2", name="name2"),
                type="function",
            )
        ],
    )

    assert chat_completion_message_to_param(
        data_no_tools_no_func
    ) == OpenAIChatCompletionAssistantMessageParam(
        content="content",
        role="assistant",
    )
