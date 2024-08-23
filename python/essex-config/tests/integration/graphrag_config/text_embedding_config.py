# Copyright (c) 2024 Microsoft Corporation.
# Licensed under the MIT License

"""Parameterization settings for the default configuration."""

from typing import Any

from pydantic import Field

import tests.integration.graphrag_config.defaults as defs

from .enums import TextEmbeddingTarget
from .llm_config import LLMConfig


class TextEmbeddingConfig(LLMConfig):
    """Configuration section for text embeddings."""

    batch_size: int = Field(
        description="The batch size to use.", default=defs.EMBEDDING_BATCH_SIZE
    )
    batch_max_tokens: int = Field(
        description="The batch max tokens to use.",
        default=defs.EMBEDDING_BATCH_MAX_TOKENS,
    )
    target: TextEmbeddingTarget = Field(
        description="The target to use. 'all' or 'required'.",
        default=defs.EMBEDDING_TARGET,
    )
    skip: list[str] = Field(description="The specific embeddings to skip.", default=[])
    vector_store: dict | None = Field(
        description="The vector storage configuration", default=None
    )
    strategy: dict[str, Any] | None = Field(
        description="The override strategy to use.", default=None
    )
