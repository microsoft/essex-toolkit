# Copyright (c) 2024 Microsoft Corporation.

"""OpenAI embeddings input/output types."""

from typing import TypeAlias

from fnllm.openai.types.aliases import OpenAIEmbeddingModel
from fnllm.types.generalized import EmbeddingsLLMInput, EmbeddingsLLMOutput
from fnllm.types.metrics import LLMUsageMetrics

OpenAIEmbeddingsInput: TypeAlias = EmbeddingsLLMInput
"""Main input type for OpenAI embeddings."""


class OpenAIEmbeddingsOutput(EmbeddingsLLMOutput):
    """OpenAI embeddings completion output."""

    raw_input: OpenAIEmbeddingsInput | None
    """Raw input that resulted in this output."""

    raw_output: list[OpenAIEmbeddingModel]
    """Raw embeddings output from OpenAI."""

    usage: LLMUsageMetrics | None
    """Usage statistics for the embeddings request."""
