# Copyright (c) 2024 Microsoft Corporation.
"""OpenAI JSON Handler."""

from __future__ import annotations

from typing import TYPE_CHECKING

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
            raise NotImplementedError


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
