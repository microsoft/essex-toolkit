# Copyright (c) 2025 Microsoft Corporation.

"""Tests for openai.llm.features.json_parsing."""

import json
from typing import Any
from unittest.mock import AsyncMock

from fnllm.base.config.json_strategy import JsonStrategy
from fnllm.openai.services.openai_json import create_json_handler
from fnllm.openai.types.chat.io import OpenAIChatOutput
from fnllm.types.io import LLMOutput
from openai.types.chat import ChatCompletionMessage
from pydantic import BaseModel

from fnllm_tests.unit.openai.llm.conftest import mock_chat_completion_model


class CustomModel(BaseModel):
    integer: int
    string: str


def mock_output(response: str, parsed_output: Any = None) -> OpenAIChatOutput:
    return OpenAIChatOutput(
        content=response,
        raw_input=None,
        raw_model=mock_chat_completion_model(),
        raw_output=ChatCompletionMessage(content=response, role="assistant"),
        usage=None,
        parsed_json_model=parsed_output,
    )


async def test_structured_mode_handlers():
    handler = create_json_handler(JsonStrategy.STRUCTURED, 0)
    assert handler is not None

    expected = CustomModel(integer=1, string="value")
    expected_str = expected.model_dump_json(exclude_none=True)
    delegate = AsyncMock(
        return_value=LLMOutput(output=mock_output(expected_str, expected))
    )
    llm = handler.decorate(delegate)
    assert llm is not None

    # call the llm and assert result
    response = await llm("prompt", json=CustomModel)
    assert response.parsed_json == expected


async def test_loose_mode_handlers():
    expected_raw_json = {"integer": 1, "string": "value"}
    raw_json_str = json.dumps(expected_raw_json)
    delegate = AsyncMock(return_value=LLMOutput(output=mock_output(raw_json_str)))
    handler = create_json_handler(JsonStrategy.LOOSE, 0)
    assert handler is not None
    llm = handler.decorate(delegate)

    # call the llm and assert result
    prompt = "prompt"
    response = await llm(prompt, json=True)
    assert response.output.content == raw_json_str
    assert response.raw_json == expected_raw_json
    assert response.parsed_json is None
    delegate.assert_called_once()
