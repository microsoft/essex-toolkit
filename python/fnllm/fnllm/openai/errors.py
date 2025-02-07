# Copyright (c) 2024 Microsoft Corporation.
"""fnllm OpenAI-specific Errors."""

from .llm.openai_embeddings_batcher import CannotSplitBatchError
from .services.openai_text_service import InvalidMaxLengthError

__all__ = ["CannotSplitBatchError", "InvalidMaxLengthError"]
