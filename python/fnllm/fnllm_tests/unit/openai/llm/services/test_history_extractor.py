# Copyright (c) 2025 Microsoft Corporation.

"""Tests for openai.llm.features.history_tracking."""

from fnllm.openai.roles import OpenAIChatRole
from fnllm.openai.services.openai_history_extractor import (
    OpenAIHistoryExtractor,
)
from fnllm.openai.types.aliases import (
    OpenAIChatCompletionMessageModel,
)
from fnllm.openai.types.chat.io import OpenAIChatOutput

from fnllm_tests.unit.openai.llm.conftest import mock_chat_completion_model


def test_history_is_appended():
    previous_history = [
        OpenAIChatRole.System.message("some system message"),
        OpenAIChatRole.User.message("user message 1"),
        OpenAIChatRole.Assistant.message("assistant message 1"),
    ]
    response = OpenAIChatOutput(
        raw_model=mock_chat_completion_model(),
        raw_input=OpenAIChatRole.User.message("user message 2"),
        raw_output=OpenAIChatCompletionMessageModel(
            content="assistant message 2",
            role="assistant",
        ),
        content="assistant message 2",
        usage=None,
    )

    # creating the LLM
    extractor = OpenAIHistoryExtractor()

    # call the llm and assert result
    response = extractor.extract_history(previous_history, response)
    assert response == [
        *previous_history,
        OpenAIChatRole.User.message("user message 2"),
        OpenAIChatRole.Assistant.message("assistant message 2"),
    ]
