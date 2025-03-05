# Copyright 2024 Microsoft Corporation.

"""Tests for openai.llm.features.rate_limiting."""

import tiktoken
from fnllm.openai.roles import OpenAIChatRole
from fnllm.openai.services.openai_token_estimator import OpenAITokenEstimator
from fnllm.tools import LLMTool
from pydantic import Field


class TestTool(LLMTool):
    __test__ = False  # this is not a pytest class

    """TestTool description."""

    a: str = Field(description="TestTool argument A.", default="10")


def test_estimate_request_tokens():
    encoding = tiktoken.get_encoding("cl100k_base")
    rl = OpenAITokenEstimator(encoding=encoding)
    prompt = "test"

    estimate = rl(prompt, {})
    assert estimate > 0

    # tools should be used in the estimate
    estimate_with_tools = rl(prompt, {"tools": [TestTool]})
    assert estimate_with_tools > estimate

    # history should be used in the estimate
    estimate_with_history = rl(
        prompt, {"history": [OpenAIChatRole.System.message("system message")]}
    )
    assert estimate_with_history > estimate

    big_prompt = "token " * 1000
    assert abs(rl(big_prompt, {}) - len(encoding.encode(big_prompt))) < 10
