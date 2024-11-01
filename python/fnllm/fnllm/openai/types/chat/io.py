# Copyright (c) 2024 Microsoft Corporation.

"""OpenAI input/output types."""

from collections.abc import AsyncIterable, Awaitable, Callable
from typing import ClassVar, TypeAlias

from pydantic import BaseModel, ConfigDict, Field

from fnllm.openai.types.aliases import (
    OpenAIChatCompletionMessageModel,
    OpenAIChatCompletionMessageParam,
)
from fnllm.types.generalized import ChatLLMOutput
from fnllm.types.metrics import LLMUsageMetrics

OpenAIChatMessageInput: TypeAlias = OpenAIChatCompletionMessageParam
"""OpenAI chat message input."""

OpenAIChatHistoryEntry: TypeAlias = OpenAIChatCompletionMessageParam
"""OpenAI chat history entry."""

OpenAIChatCompletionInput: TypeAlias = str | OpenAIChatMessageInput | None
"""Main input type for OpenAI completions."""


class OpenAIChatOutput(ChatLLMOutput):
    """OpenAI chat completion output."""

    raw_input: OpenAIChatMessageInput | None
    """Raw input that resulted in this output."""

    raw_output: OpenAIChatCompletionMessageModel
    """Raw output message from OpenAI."""

    usage: LLMUsageMetrics | None
    """Usage statistics for the completion request."""


class OpenAIStreamingChatOutput(BaseModel, arbitrary_types_allowed=True):
    """Async iterable chat content."""

    model_config: ClassVar[ConfigDict] = ConfigDict(arbitrary_types_allowed=True)

    raw_input: OpenAIChatMessageInput | None = Field(
        default=None, description="Raw input that resulted in this output."
    )

    usage: LLMUsageMetrics | None = Field(
        default=None,
        description="Usage statistics for the completion request.\nThis will only be available after the stream is complete, if the LLM has been configured to emit usage.",
    )

    content: AsyncIterable[str | None] = Field(exclude=True)

    close: Callable[[], Awaitable[None]] = Field(
        description="Close the underlying iterator", exclude=True
    )
