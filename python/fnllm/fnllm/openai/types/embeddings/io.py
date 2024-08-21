# Copyright (c) 2024 Microsoft Corporation.

"""OpenAI embeddings input/output types."""

from typing import TypeAlias

from pydantic import BaseModel

from fnllm.openai.types.aliases import OpenAIEmbeddingModel
from fnllm.types.metrics import LLMUsageMetrics

OpenAIEmbeddingsInput: TypeAlias = list[str] | str
"""Main input type for OpenAI embeddings."""


class OpenAIEmbeddingsOutput(BaseModel):
    """OpenAI embeddings completion output."""

    raw_input: OpenAIEmbeddingsInput | None
    """Raw input that resulted in this output."""

    raw_output: list[OpenAIEmbeddingModel]
    """Raw embeddings output from OpenAI."""

    embeddings: list[list[float]] | None
    """Parsed embeddings output."""

    usage: LLMUsageMetrics | None
    """Usage statistics for the embeddings request."""
