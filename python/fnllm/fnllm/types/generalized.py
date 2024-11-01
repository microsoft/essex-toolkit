# Copyright (c) 2024 Microsoft Corporation.
"""Generalized LLM Types."""

from typing import Any, TypeAlias, TypeVar

from pydantic import BaseModel

from .generics import THistoryEntry, TModelParameters
from .protocol import LLM

EmbeddingsLLMInput: TypeAlias = list[str] | str
"""Generic Embedding Input"""


class EmbeddingsLLMOutput(BaseModel):
    """Embedding LLM Output."""

    embeddings: list[list[float]] | None


TEmbeddingsInput = TypeVar("TEmbeddingsInput", bound=EmbeddingsLLMInput, covariant=True)
TEmbeddingsOutput = TypeVar(
    "TEmbeddingsOutput", bound=EmbeddingsLLMOutput, covariant=True
)
EmbeddingsLLM: TypeAlias = LLM[
    TEmbeddingsInput, TEmbeddingsOutput, None, TModelParameters
]
"""Embedding LLM type alias."""

ChatLLMInput: TypeAlias = str | dict[str, Any] | None
"""Generic Completion Input."""


class ChatLLMOutput(BaseModel):
    """Completion LLM Output."""

    content: str | None
    """Raw completion output."""

    def __str__(self) -> str:
        """String representation o the output."""
        return self.content or ""


TChatInput = TypeVar("TChatInput", bound=ChatLLMInput, covariant=True)
TChatOutput = TypeVar("TChatOutput", bound=ChatLLMOutput, covariant=True)
ChatLLM: TypeAlias = LLM[TChatInput, TChatOutput, THistoryEntry, TModelParameters]
"""Generic Completion LLM type alias."""
