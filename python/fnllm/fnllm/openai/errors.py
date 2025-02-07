# Copyright (c) 2024 Microsoft Corporation.
"""fnllm OpenAI-specific Errors."""

from .llm.openai_embeddings_batcher import CannotSplitBatchError

__all__ = ["CannotSplitBatchError"]
