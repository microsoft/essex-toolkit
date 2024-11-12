# Copyright (c) 2024 Microsoft Corporation.
"""OpenAI Chat LLM."""

from typing import Any, Literal, overload

from typing_extensions import Unpack

from fnllm.openai.types.chat.io import (
    OpenAIChatCompletionInput,
    OpenAIChatHistoryEntry,
    OpenAIChatOutput,
    OpenAIStreamingChatOutput,
)
from fnllm.openai.types.chat.parameters import OpenAIChatParameters
from fnllm.openai.types.client import (
    OpenAIChatLLM,
    OpenAIStreamingChatLLM,
    OpenAITextChatLLM,
)
from fnllm.types.generics import TJsonModel
from fnllm.types.io import LLMInput, LLMOutput


class OpenAIChatLLMImpl(OpenAIChatLLM):
    """The OpenAIChatLLM Facade."""

    def __init__(
        self,
        *,
        text_chat_llm: OpenAITextChatLLM,
        streaming_chat_llm: OpenAIStreamingChatLLM,
    ):
        """Create a new OpenAI Chat Facade."""
        self._text_chat_llm = text_chat_llm
        self._streaming_chat_llm = streaming_chat_llm

    def child(self, name: str) -> "OpenAIChatLLMImpl":
        """Create a child LLM (with child cache)."""
        return OpenAIChatLLMImpl(
            text_chat_llm=self._text_chat_llm.child(name),
            streaming_chat_llm=self._streaming_chat_llm.child(name),
        )

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

    async def __call__(
        self,
        prompt: OpenAIChatCompletionInput,
        *,
        stream: bool | None = None,
        **kwargs: Unpack[
            LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters]
        ],
    ) -> LLMOutput[
        Any | OpenAIStreamingChatOutput | OpenAIChatOutput,
        TJsonModel,
        OpenAIChatHistoryEntry,
    ]:
        """Invoke the streaming chat output."""
        if stream:
            return await self._streaming_chat_llm(prompt, **kwargs)

        return await self._text_chat_llm(prompt, **kwargs)
