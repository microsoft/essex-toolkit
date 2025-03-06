# Copyright (c) 2024 Microsoft Corporation.

"""OpenAI client types."""

from __future__ import annotations

from typing import (
    TYPE_CHECKING,
    Literal,
    Protocol,
    TypeAlias,
    overload,
    runtime_checkable,
)

from openai import AsyncAzureOpenAI, AsyncOpenAI
from typing_extensions import Unpack

from fnllm.openai.types.chat.io import (
    OpenAIChatCompletionInput,
    OpenAIChatHistoryEntry,
    OpenAIChatOutput,
    OpenAIStreamingChatOutput,
)
from fnllm.openai.types.chat.parameters import OpenAIChatParameters
from fnllm.openai.types.embeddings.io import (
    OpenAIEmbeddingsInput,
    OpenAIEmbeddingsOutput,
)
from fnllm.openai.types.embeddings.parameters import OpenAIEmbeddingsParameters
from fnllm.types.protocol import LLM

if TYPE_CHECKING:
    from fnllm.types.generics import TJsonModel
    from fnllm.types.io import LLMInput, LLMOutput

OpenAIClient = AsyncOpenAI | AsyncAzureOpenAI
"""Allowed OpenAI client types."""

OpenAITextChatLLM: TypeAlias = LLM[
    OpenAIChatCompletionInput,
    OpenAIChatOutput,
    OpenAIChatHistoryEntry,
    OpenAIChatParameters,
]
"""Alias for the fully typed OpenAIChatLLM instance."""

OpenAIStreamingChatLLM: TypeAlias = LLM[
    OpenAIChatCompletionInput,
    OpenAIStreamingChatOutput,
    OpenAIChatHistoryEntry,
    OpenAIChatParameters,
]

OpenAIEmbeddingsLLM: TypeAlias = LLM[
    OpenAIEmbeddingsInput, OpenAIEmbeddingsOutput, None, OpenAIEmbeddingsParameters
]
"""Alias for the fully typed OpenAIEmbeddingsLLM instance."""


@runtime_checkable
class OpenAIChatLLM(Protocol):  # pragma: no cover
    """Protocol for the OpenAI chat LLM."""

    @overload
    async def __call__(
        self,
        prompt: OpenAIChatCompletionInput,
        *,
        stream: Literal[True],
        **kwargs: Unpack[
            LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters]
        ],
    ) -> LLMOutput[OpenAIStreamingChatOutput, TJsonModel, OpenAIChatHistoryEntry]: ...

    @overload
    async def __call__(
        self,
        prompt: OpenAIChatCompletionInput,
        *,
        stream: Literal[False] | None = None,
        **kwargs: Unpack[
            LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters]
        ],
    ) -> LLMOutput[OpenAIChatOutput, TJsonModel, OpenAIChatHistoryEntry]: ...

    def child(self, name: str) -> OpenAIChatLLM:
        """Create a child LLM."""
        ...

    def is_reasoning_model(self) -> bool:
        """Return whether the LLM uses a reasoning model."""
        ...
