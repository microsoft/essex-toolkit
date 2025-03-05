# Copyright (c) 2024 Microsoft Corporation.

"""Tests for openai.llm.features.tool_parsing."""

import json
from unittest.mock import AsyncMock

import pytest
from fnllm.openai.services.openai_tools_parsing import OpenAIParseToolsLLM
from fnllm.openai.types.aliases import (
    OpenAIChatCompletionMessageModel,
    OpenAIChatCompletionMessageToolCallModel,
    OpenAIFunctionModel,
)
from fnllm.openai.types.chat.io import OpenAIChatOutput
from fnllm.tools.base import LLMTool
from fnllm.tools.errors import ToolInvalidArgumentsError, ToolNotFoundError
from fnllm.types.io import LLMOutput
from pydantic import Field

from fnllm_tests.unit.openai.llm.conftest import mock_chat_completion_model


class ToolA(LLMTool):
    """Tool A description."""

    a: str = Field(description="ToolA argument A.", default="10")


class ToolB(LLMTool):
    """Tool B description."""

    __tool_name__ = "tool_b"

    __tool_description__ = "Tool B alternative description."

    b: str = Field(
        description="ToolB argument B.",
    )


async def test_tool_attributes():
    tool_a = ToolA()
    tool_b = ToolB(b="b")

    assert tool_a.name == "ToolA"
    assert tool_a.description == "Tool A description."
    assert await tool_a.execute() is None

    assert tool_b.name == "tool_b"
    assert tool_b.description == "Tool B alternative description."
    assert await tool_b.execute() is None


async def test_tools_are_parsed():
    tools = [ToolA, ToolB]
    expected_output = OpenAIChatOutput(
        raw_input=None,
        raw_model=mock_chat_completion_model(),
        raw_output=OpenAIChatCompletionMessageModel(
            content="content",
            role="assistant",
            tool_calls=[
                OpenAIChatCompletionMessageToolCallModel(
                    id="call_1",
                    function=OpenAIFunctionModel(
                        arguments=json.dumps({"a": "value_a"}), name=ToolA.get_name()
                    ),
                    type="function",
                ),
                OpenAIChatCompletionMessageToolCallModel(
                    id="call_2",
                    function=OpenAIFunctionModel(
                        arguments=json.dumps({"b": "value_b"}), name=ToolB.get_name()
                    ),
                    type="function",
                ),
            ],
        ),
        content=None,
        usage=None,
    )
    expected_tool_calls = [
        ToolA(
            call_id="call_1",
            a="value_a",
            __raw_arguments_json__=json.dumps({"a": "value_a"}),
        ),
        ToolB(
            call_id="call_2",
            b="value_b",
            __raw_arguments_json__=json.dumps({"b": "value_b"}),
        ),
    ]
    delegate = AsyncMock(return_value=LLMOutput(output=expected_output))
    prompt = "prompt"

    # creating the LLM
    llm = OpenAIParseToolsLLM(delegate)

    # call the llm and assert result
    response = await llm(prompt, tools=tools)
    assert response.output == expected_output
    assert response.tool_calls == expected_tool_calls

    # assert response if properly serializing tool calls
    dump = response.model_dump()
    assert dump["tool_calls"] == [t.model_dump() for t in expected_tool_calls]

    # assert the delegate has been called with the tools schema
    delegate.assert_called_once_with(
        prompt,
        tools=tools,
        model_parameters={
            "tools": [
                {
                    "function": {
                        "name": "ToolA",
                        "description": "Tool A description.",
                        "parameters": {
                            "properties": {
                                "a": {
                                    "default": "10",
                                    "description": "ToolA argument A.",
                                    "title": "A",
                                    "type": "string",
                                },
                            },
                            "type": "object",
                        },
                    },
                    "type": "function",
                },
                {
                    "function": {
                        "name": "tool_b",
                        "description": "Tool B alternative description.",
                        "parameters": {
                            "properties": {
                                "b": {
                                    "description": "ToolB argument B.",
                                    "title": "B",
                                    "type": "string",
                                },
                            },
                            "required": ["b"],
                            "type": "object",
                        },
                    },
                    "type": "function",
                },
            ]
        },
    )


async def test_no_tools_given():
    expected_output = OpenAIChatOutput(
        raw_input=None,
        raw_model=mock_chat_completion_model(),
        raw_output=OpenAIChatCompletionMessageModel(
            content="content",
            role="assistant",
            tool_calls=None,
        ),
        content=None,
        usage=None,
    )
    delegate = AsyncMock(return_value=LLMOutput(output=expected_output))
    prompt = "prompt"

    # creating the LLM
    llm = OpenAIParseToolsLLM(delegate)

    # call the llm and assert result
    response = await llm(prompt, tools=[])
    assert response.output == expected_output
    assert len(response.tool_calls) == 0

    # assert the delegate has called been called without tools in model parameters
    delegate.assert_called_once_with(
        prompt,
        tools=[],
    )


async def test_invalid_tool_arguments_should_raise():
    tools = [ToolA, ToolB]
    expected_output = OpenAIChatOutput(
        raw_input=None,
        raw_model=mock_chat_completion_model(),
        raw_output=OpenAIChatCompletionMessageModel(
            content="content",
            role="assistant",
            tool_calls=[
                OpenAIChatCompletionMessageToolCallModel(
                    id="call_1",
                    function=OpenAIFunctionModel(
                        arguments=json.dumps({"a": "value_a"}), name=ToolA.get_name()
                    ),
                    type="function",
                ),
                OpenAIChatCompletionMessageToolCallModel(
                    id="call_2",
                    function=OpenAIFunctionModel(
                        # missing arguments
                        arguments=json.dumps({}),
                        name=ToolB.get_name(),
                    ),
                    type="function",
                ),
            ],
        ),
        content=None,
        usage=None,
    )
    delegate = AsyncMock(return_value=LLMOutput(output=expected_output))
    prompt = "prompt"

    # creating the LLM
    llm = OpenAIParseToolsLLM(delegate)

    # call the llm and assert error is raised
    with pytest.raises(ToolInvalidArgumentsError):
        await llm(prompt, tools=tools)


async def test_tool_not_found_should_raise():
    expected_output = OpenAIChatOutput(
        raw_input=None,
        raw_model=mock_chat_completion_model(),
        raw_output=OpenAIChatCompletionMessageModel(
            content="content",
            role="assistant",
            tool_calls=[
                OpenAIChatCompletionMessageToolCallModel(
                    id="call_1",
                    function=OpenAIFunctionModel(
                        arguments=json.dumps({"a": "value_a"}), name=ToolA.get_name()
                    ),
                    type="function",
                ),
                OpenAIChatCompletionMessageToolCallModel(
                    id="call_2",
                    function=OpenAIFunctionModel(
                        arguments=json.dumps({}),
                        # this tool does not exist
                        name="NotExistingTool",
                    ),
                    type="function",
                ),
            ],
        ),
        content=None,
        usage=None,
    )
    delegate = AsyncMock(return_value=LLMOutput(output=expected_output))
    prompt = "prompt"

    # creating the LLM
    llm = OpenAIParseToolsLLM(delegate)

    # call the llm and assert error is raised
    with pytest.raises(ToolNotFoundError):
        await llm(prompt, tools=[ToolA])
