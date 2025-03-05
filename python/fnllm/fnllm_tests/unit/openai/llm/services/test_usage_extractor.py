# Copyright (c) 2024 Microsoft Corporation.

"""Tests for openai.llm.features.chat_usage_metrics_parsing."""

from fnllm.openai.services.openai_usage_extractor import (
    OpenAIUsageExtractor,
)
from fnllm.openai.types.aliases import (
    OpenAIChatCompletionMessageModel,
)
from fnllm.openai.types.chat.io import OpenAIChatOutput
from fnllm.types.metrics import LLMUsageMetrics

from fnllm_tests.unit.openai.llm.conftest import mock_chat_completion_model


def test_metrics_are_included():
    response = OpenAIChatOutput(
        raw_input=None,
        raw_model=mock_chat_completion_model(),
        raw_output=OpenAIChatCompletionMessageModel(
            content="content", role="assistant"
        ),
        content=None,
        # usage is sent
        usage=LLMUsageMetrics(input_tokens=15, output_tokens=20),
    )
    # creating the LLM
    extractor = OpenAIUsageExtractor()

    # call the llm and assert result
    extracted = extractor.extract_usage(response)
    assert extracted == response.usage


def test_metrics_are_not_included():
    response = OpenAIChatOutput(
        raw_input=None,
        raw_model=mock_chat_completion_model(),
        raw_output=OpenAIChatCompletionMessageModel(
            content="content", role="assistant"
        ),
        content=None,
        # no usage is sent
        usage=None,
    )

    # creating the LLM
    extractor = OpenAIUsageExtractor()

    # call the llm and assert result
    usage = extractor.extract_usage(response)
    assert usage == LLMUsageMetrics(input_tokens=0, output_tokens=0)
