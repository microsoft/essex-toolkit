# Copyright 2024 Microsoft Corporation.

"""Tests for openai.llm.features.rate_limiting."""

from unittest.mock import AsyncMock

import tiktoken
from fnllm.limiting.base import Limiter
from fnllm.openai.llm.services.rate_limiter import OpenAIRateLimiter
from fnllm.openai.roles import OpenAIChatRole
from fnllm.tools import LLMTool
from pydantic import Field


class TestTool(LLMTool):
    __test__ = False  # this is not a pytest class

    """TestTool description."""

    a: str = Field(description="TestTool argument A.", default=10)


def test_estimate_request_tokens():
    limiter = AsyncMock(spec=Limiter)
    rl = OpenAIRateLimiter(
        encoder=tiktoken.get_encoding("cl100k_base"), limiter=limiter
    )
    prompt = "test"

    estimate = rl._estimate_request_tokens(prompt, {})
    assert estimate > 0

    # tools should be used in the estimate
    estimate_with_tools = rl._estimate_request_tokens(prompt, {"tools": [TestTool]})
    assert estimate_with_tools > estimate

    # history should be used in the estimate
    estimate_with_history = rl._estimate_request_tokens(
        prompt, {"history": [OpenAIChatRole.System.message("system message")]}
    )
    assert estimate_with_history > estimate
