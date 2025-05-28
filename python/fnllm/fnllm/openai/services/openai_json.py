# Copyright (c) 2024 Microsoft Corporation.
"""OpenAI JSON Handler."""

from __future__ import annotations

from typing import TYPE_CHECKING, cast

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
from fnllm.openai.types.chat.parameters import OpenAIChatParameters
from fnllm.types.generics import (
    TJsonModel,
)

if TYPE_CHECKING:
    from collections.abc import Awaitable, Callable

    from fnllm.types.io import LLMInput, LLMOutput


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
            return OpenAIStructuredJsonReceiver(marshaler, max_retries)


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
        self,
        output: LLMOutput[OpenAIChatOutput, TJsonModel, OpenAIChatHistoryEntry],
    ) -> str | None:
        """Extract the JSON string from the output."""
        return output.output.content


class OpenAIStructuredJsonReceiver(
    JsonReceiver[
        OpenAIChatCompletionInput,
        OpenAIChatOutput,
        OpenAIChatHistoryEntry,
        OpenAIChatParameters,
    ]
):
    """A decorator for handling JSON output in structured mode."""

    async def invoke_json(
        self,
        delegate: Callable[
            ...,
            Awaitable[LLMOutput[OpenAIChatOutput, TJsonModel, OpenAIChatHistoryEntry]],
        ],
        prompt: OpenAIChatCompletionInput,
        kwargs: LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters],
    ) -> LLMOutput[OpenAIChatOutput, TJsonModel, OpenAIChatHistoryEntry]:
        """Invoke the JSON decorator."""
        result = await delegate(prompt, **kwargs)
        model = cast(TJsonModel, result.output.parsed_json_model)
        result.parsed_json = model
        return result
