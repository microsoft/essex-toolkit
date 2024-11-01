# Copyright (c) 2024 Microsoft Corporation.

"""Common type definitions for the LLM package."""

from .generalized import (
    ChatLLM,
    ChatLLMInput,
    ChatLLMOutput,
    EmbeddingsLLM,
    EmbeddingsLLMInput,
    EmbeddingsLLMOutput,
)
from .generics import (
    JSON,
    PromptVariables,
    THistoryEntry,
    TInput,
    TJsonModel,
    TModelParameters,
    TOutput,
)
from .io import LLMInput, LLMOutput
from .metrics import LLMMetrics, LLMRetryMetrics, LLMUsageMetrics
from .protocol import LLM

__all__ = [
    "JSON",
    "LLM",
    "ChatLLM",
    "ChatLLMInput",
    "ChatLLMOutput",
    "EmbeddingsLLM",
    "EmbeddingsLLMInput",
    "EmbeddingsLLMOutput",
    "LLMInput",
    "LLMMetrics",
    "LLMOutput",
    "LLMRetryMetrics",
    "LLMUsageMetrics",
    "PromptVariables",
    "THistoryEntry",
    "TInput",
    "TJsonModel",
    "TModelParameters",
    "TOutput",
]
