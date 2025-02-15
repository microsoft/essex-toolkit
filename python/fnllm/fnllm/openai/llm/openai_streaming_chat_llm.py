# Copyright (c) 2024 Microsoft Corporation.

"""The chat-based LLM implementation."""

from __future__ import annotations

import traceback
from collections.abc import AsyncIterator, Callable, Iterator
from typing import TYPE_CHECKING, TypeAlias, cast

from openai import AsyncStream
from openai.types.chat import ChatCompletionChunk
from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam

from fnllm.base.base_llm import BaseLLM
from fnllm.openai.types.chat.io import (
    OpenAIChatCompletionInput,
    OpenAIChatHistoryEntry,
    OpenAIStreamingChatOutput,
)
from fnllm.openai.types.chat.parameters import OpenAIChatParameters
from fnllm.openai.utils import build_chat_messages, is_reasoning_model
from fnllm.types import LLMMetrics, LLMUsageMetrics

if TYPE_CHECKING:
    from fnllm.base.services.rate_limiter import RateLimiter
    from fnllm.base.services.retryer import Retryer
    from fnllm.base.services.variable_injector import VariableInjector
    from fnllm.events.base import LLMEvents
    from fnllm.openai.types.aliases import OpenAIChatModelName
    from fnllm.openai.types.client import OpenAIClient
    from fnllm.types.generics import TJsonModel
    from fnllm.types.io import LLMInput

ChunkStream: TypeAlias = AsyncStream[ChatCompletionChunk]


class OpenAIStreamingChatLLMImpl(
    BaseLLM[
        OpenAIChatCompletionInput,
        OpenAIStreamingChatOutput,
        OpenAIChatHistoryEntry,
        OpenAIChatParameters,
    ]
):
    """A chat-based LLM."""

    def __init__(
        self,
        client: OpenAIClient,
        model: str | OpenAIChatModelName,
        *,
        variable_injector: VariableInjector | None = None,
        rate_limiter: RateLimiter[
            OpenAIChatCompletionInput,
            OpenAIStreamingChatOutput,
            OpenAIChatHistoryEntry,
            OpenAIChatParameters,
        ]
        | None = None,
        retryer: Retryer[
            OpenAIChatCompletionInput,
            OpenAIStreamingChatOutput,
            OpenAIChatHistoryEntry,
            OpenAIChatParameters,
        ]
        | None = None,
        emit_usage: bool = False,
        model_parameters: OpenAIChatParameters | None = None,
        events: LLMEvents | None = None,
    ):
        """Create a new OpenAIChatLLM."""
        super().__init__(
            events=events,
            variable_injector=variable_injector,
            rate_limiter=rate_limiter,
            retryer=retryer,
        )

        self._client = client
        self._model = model
        self._emit_usage = emit_usage
        self._global_model_parameters = model_parameters or {}

    def child(self, name: str) -> OpenAIStreamingChatLLMImpl:
        """Create a child LLM."""
        return self

    def is_reasoning_model(self) -> bool:
        """Return whether the LLM uses a reasoning model."""
        return is_reasoning_model(self._model)

    def _build_completion_parameters(
        self, local_parameters: OpenAIChatParameters | None
    ) -> OpenAIChatParameters:
        params: OpenAIChatParameters = {
            "model": self._model,
            **self._global_model_parameters,
            **(local_parameters or {}),
        }

        return params

    async def _execute_llm(
        self,
        prompt: OpenAIChatCompletionInput,
        kwargs: LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters],
    ) -> OpenAIStreamingChatOutput:
        history = kwargs.get("history", [])
        local_model_parameters = kwargs.get("model_parameters")
        messages, prompt_message = build_chat_messages(prompt, history)
        completion_parameters = self._build_completion_parameters(
            local_model_parameters
        )

        completion_kwargs = {**completion_parameters, "stream": True}
        if self._emit_usage:
            completion_kwargs["stream_options"] = {"include_usage": True}

        completion: ChunkStream = await self._client.chat.completions.create(
            messages=cast(Iterator[ChatCompletionMessageParam], messages),
            **completion_kwargs,
        )

        iterator = StreamingChatIterator(chunks=completion, events=self._events)
        result = OpenAIStreamingChatOutput(
            raw_input=prompt_message,
            content=iterator.iterator,
            close=iterator.close,
        )

        def handle_usage(usage: LLMUsageMetrics) -> None:
            result.usage = usage

        iterator.on_usage(handle_usage)
        return result


class StreamingChatIterator:
    """A streaming llm response iterator."""

    def __init__(
        self,
        chunks: ChunkStream,
        events: LLMEvents,
    ):
        """Create a new Response."""
        self._chunks = chunks
        self._events = events
        self._iterator = self.__stream__()

    def on_usage(self, cb: Callable[[LLMUsageMetrics], None]) -> None:
        """Handle usage events."""
        self._on_usage = cb

    async def __stream__(self) -> AsyncIterator[str | None]:
        """Read chunks from the stream."""
        usage = LLMUsageMetrics()
        try:
            async for chunk in self._chunks:
                # Note: this is only emitted _just_ prior to the stream completing.
                if chunk.usage:
                    usage = LLMUsageMetrics(
                        input_tokens=chunk.usage.prompt_tokens,
                        output_tokens=chunk.usage.completion_tokens,
                    )
                    if self._on_usage:
                        self._on_usage(usage)
                    await self._events.on_usage(usage)

                if chunk.choices and len(chunk.choices) > 0:
                    yield chunk.choices[0].delta.content
        except BaseException as e:
            stack_trace = traceback.format_exc()
            await self._events.on_error(e, stack_trace, {"streaming": True})
            raise

        self._on_usage = None
        await self._events.on_success(
            LLMMetrics(
                estimated_input_tokens=usage.input_tokens,
                usage=usage,
            )
        )

    @property
    def iterator(self) -> AsyncIterator[str | None]:
        """Return the content."""
        return self._iterator

    async def close(self) -> None:
        """Close the stream."""
        await self._chunks.close()
