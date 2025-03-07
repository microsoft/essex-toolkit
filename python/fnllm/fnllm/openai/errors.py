# Copyright (c) 2024 Microsoft Corporation.
"""fnllm OpenAI-specific Errors."""

from .llm.openai_embeddings_batcher import CannotSplitBatchError
from .llm.openai_text_chat_llm import OpenAINoChoicesAvailableError
from .services.openai_text_service import InvalidMaxLengthError

__all__ = [
    "CannotSplitBatchError",
    "InvalidMaxLengthError",
    "OpenAINoChoicesAvailableError",
]
