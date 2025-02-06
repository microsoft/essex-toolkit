# Copyright (c) 2024 Microsoft Corporation.

"""LLM metrics parsing module for OpenAI."""

from __future__ import annotations

from typing import Generic, TypeVar

from fnllm.base.services.usage_extractor import UsageExtractor
from fnllm.openai.types.chat.io import OpenAIChatOutput
from fnllm.openai.types.embeddings.io import OpenAIEmbeddingsOutput
from fnllm.types.metrics import LLMUsageMetrics

TOutputWithUsageMetrics = TypeVar(
    "TOutputWithUsageMetrics", OpenAIChatOutput, OpenAIEmbeddingsOutput
)
"""Represents the support output types for usage metrics parsing."""


class OpenAIUsageExtractor(
    UsageExtractor[TOutputWithUsageMetrics],
    Generic[TOutputWithUsageMetrics],
):
    """An OpenAI usage metrics parsing LLM."""

    def extract_usage(self, output: TOutputWithUsageMetrics) -> LLMUsageMetrics:
        """Extract the LLM Usage from an OpenAI response."""
        return output.usage or LLMUsageMetrics()
