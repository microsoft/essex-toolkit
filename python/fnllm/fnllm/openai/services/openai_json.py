# Copyright (c) 2024 Microsoft Corporation.
"""OpenAI JSON Handler."""

from __future__ import annotations

from typing import TYPE_CHECKING, Generic

from typing_extensions import Unpack

from fnllm.base.config.json_strategy import JsonStrategy
from fnllm.base.services.json import (
    JsonMarshaler,
    JsonReceiver,
    LooseModeJsonReceiver,
)
from fnllm.openai.types.chat.io import (
    OpenAIChatCompletionInput,
    OpenAIChatHistoryEntry,
    OpenAIChatOutput,
)
from fnllm.types.generics import (
    THistoryEntry,
    TInput,
    TJsonModel,
    TModelParameters,
    TOutput,
)

if TYPE_CHECKING:
    from collections.abc import Awaitable, Callable

    from fnllm.types.io import LLMInput, LLMOutput


if TYPE_CHECKING:
    from fnllm.openai.types.chat.parameters import OpenAIChatParameters
    from fnllm.types.generics import TJsonModel
    from fnllm.types.io import LLMOutput


def create_json_handler(
    strategy: JsonStrategy,
    max_retries: int,
) -> (
    JsonReceiver[
        OpenAIChatCompletionInput,
        OpenAIChatOutput,
        OpenAIChatHistoryEntry,
        OpenAIChatParameters,
    ]
    | None
):
    """Create a JSON handler for OpenAI."""
    marshaler = OpenAIJsonMarshaler()
    match strategy:
        case JsonStrategy.NONE:
            return None
        case JsonStrategy.LOOSE:
            return LooseModeJsonReceiver(marshaler, max_retries)
        case JsonStrategy.VALID:
            return JsonReceiver(marshaler, max_retries)
        case JsonStrategy.STRUCTURED:
            return OpenAIStructuredJsonReceiver()


class OpenAIJsonMarshaler(JsonMarshaler[OpenAIChatOutput, OpenAIChatHistoryEntry]):
    """An OpenAI JSON marshaler."""

    def inject_json_string(
        self,
        json_string: str | None,
        output: LLMOutput[OpenAIChatOutput, TJsonModel, OpenAIChatHistoryEntry],
    ) -> LLMOutput[OpenAIChatOutput, TJsonModel, OpenAIChatHistoryEntry]:
        """Inject the JSON string into the output."""
        output.output.content = json_string
        return output

    def extract_json_string(
        self, output: LLMOutput[OpenAIChatOutput, TJsonModel, OpenAIChatHistoryEntry]
    ) -> str | None:
        """Extract the JSON string from the output."""
        return output.output.content


class OpenAIStructuredJsonReceiver(
    Generic[TInput, TOutput, THistoryEntry, TModelParameters],
):
    """A decorator for handling JSON output in structured mode."""

    def decorate(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
    ) -> Callable[..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]]:
        """Decorate the delegate with the JSON functionality."""

        async def invoke(
            prompt: TInput,
            **kwargs: Unpack[LLMInput[TJsonModel, THistoryEntry, TModelParameters]],
        ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
            if kwargs.get("json_model") is not None or kwargs.get("json"):
                result = await delegate(prompt, **kwargs)
                model = result.output.parsed_json_model
                result.parsed_json = model
                return result
            return await delegate(prompt, **kwargs)

        return invoke
