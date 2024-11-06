# Copyright (c) 2024 Microsoft Corporation.
"""OpenAI JSON Handler."""

from fnllm.config.json_strategy import JsonStrategy
from fnllm.openai.types.chat.io import (
    OpenAIChatCompletionInput,
    OpenAIChatHistoryEntry,
    OpenAIChatOutput,
)
from fnllm.openai.types.chat.parameters import OpenAIChatParameters
from fnllm.services.json import (
    JsonHandler,
    JsonMarshaler,
    JsonReceiver,
    JsonRequester,
    LooseModeJsonReceiver,
)
from fnllm.types.generics import TJsonModel
from fnllm.types.io import LLMInput, LLMOutput


def create_json_handler(
    strategy: JsonStrategy,
    max_retries: int,
) -> JsonHandler[OpenAIChatOutput, OpenAIChatHistoryEntry]:
    """Create a JSON handler for OpenAI."""
    marshaler = OpenAIJsonMarshaler()
    match strategy:
        case JsonStrategy.LOOSE:
            return JsonHandler(None, LooseModeJsonReceiver(marshaler, max_retries))
        case JsonStrategy.VALID:
            return JsonHandler(
                OpenAIJsonRequester(), JsonReceiver(marshaler, max_retries)
            )
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


class OpenAIJsonRequester(
    JsonRequester[
        OpenAIChatCompletionInput,
        OpenAIChatOutput,
        OpenAIChatHistoryEntry,
        OpenAIChatParameters,
    ]
):
    """An OpenAI JSON requester."""

    def rewrite_args(
        self,
        prompt: OpenAIChatCompletionInput,
        kwargs: LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters],
    ) -> tuple[
        OpenAIChatCompletionInput,
        LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters],
    ]:
        """Rewrite the input prompt and arguments.."""
        kwargs["model_parameters"] = self._enable_oai_json_mode(
            kwargs.get("model_parameters", {})
        )
        return prompt, kwargs

    def _enable_oai_json_mode(
        self, parameters: OpenAIChatParameters
    ) -> OpenAIChatParameters:
        result: OpenAIChatParameters = parameters.copy()
        result["response_format"] = {"type": "json_object"}
        return result
