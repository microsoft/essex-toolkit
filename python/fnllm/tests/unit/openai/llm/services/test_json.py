# Copyright (c) 2024 Microsoft Corporation.

"""Tests for openai.llm.features.json_parsing."""

import json
from unittest.mock import AsyncMock

import pytest
from fnllm.config.json_strategy import JsonStrategy
from fnllm.openai.llm.services.json import create_json_handler
from fnllm.openai.types.chat.io import OpenAIChatOutput
from fnllm.types.io import LLMOutput
from openai.types.chat import ChatCompletionMessage
from pydantic import BaseModel


class CustomModel(BaseModel):
    integer: int
    string: str


def mock_output(response: str) -> OpenAIChatOutput:
    return OpenAIChatOutput(
        content=response,
        raw_input=None,
        raw_output=ChatCompletionMessage(content=response, role="assistant"),
        usage=None,
    )


def test_schematic_mode_handlers():
    with pytest.raises(NotImplementedError):
        create_json_handler(JsonStrategy.STRUCTURED, 0)


async def test_loose_mode_handlers():
    expected_raw_json = {"integer": 1, "string": "value"}
    raw_json_str = json.dumps(expected_raw_json)
    delegate = AsyncMock(return_value=LLMOutput(output=mock_output(raw_json_str)))
    handlers = create_json_handler(JsonStrategy.LOOSE, 0)
    assert handlers.receiver is not None
    assert handlers.requester is None
    llm = handlers.receiver.decorate(delegate)

    # call the llm and assert result
    prompt = "prompt"
    response = await llm(prompt, json=True)
    assert response.output.content == raw_json_str
    assert response.raw_json == expected_raw_json
    assert response.parsed_json is None
    delegate.assert_called_once()
