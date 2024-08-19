# Copyright (c) 2024 Microsoft Corporation.

"""OpenAI client types."""

from typing import Literal, Protocol, TypeAlias, overload

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
from fnllm.types.generics import TJsonModel
from fnllm.types.io import LLMInput, LLMOutput
from fnllm.types.protocol import LLM

OpenAIClient = AsyncOpenAI | AsyncAzureOpenAI
"""Allowed OpenAI client types."""

OpenAITextChatLLMInstance: TypeAlias = LLM[
    OpenAIChatCompletionInput,
    OpenAIChatOutput,
    OpenAIChatHistoryEntry,
    OpenAIChatParameters,
]
"""Alias for the fully typed OpenAIChatLLM instance."""

OpenAIStreamingChatLLMInstance: TypeAlias = LLM[
    OpenAIChatCompletionInput,
    OpenAIStreamingChatOutput,
    OpenAIChatHistoryEntry,
    OpenAIChatParameters,
]

OpenAIEmbeddingsLLMInstance: TypeAlias = LLM[
    OpenAIEmbeddingsInput, OpenAIEmbeddingsOutput, None, OpenAIEmbeddingsParameters
]
"""Alias for the fully typed OpenAIEmbeddingsLLM instance."""


class OpenAIChatLLM(Protocol):
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
