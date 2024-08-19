# Copyright (c) 2024 Microsoft Corporation.
"""OpenAI JSON Handler."""

from fnllm.config.json_strategy import JsonStrategy
from fnllm.llm.services.errors import FailedToGenerateValidJsonError
from fnllm.llm.services.json import (
    JsonHandler,
    JsonMarshaler,
    JsonReceiver,
    JsonRequester,
    LooseModeJsonReceiver,
)
from fnllm.llm.types.generics import JSON, TJsonModel
from fnllm.llm.types.io import LLMInput, LLMOutput
from fnllm.openai.types.chat.io import (
    OpenAIChatCompletionInput,
    OpenAIChatHistoryEntry,
    OpenAIChatOutput,
)
from fnllm.openai.types.chat.parameters import OpenAIChatParameters


def create_json_handler(
    strategy: JsonStrategy,
) -> JsonHandler[OpenAIChatOutput, OpenAIChatHistoryEntry]:
    """Create a JSON handler for OpenAI."""
    marshaler = OpenAIJsonMarshaler()
    match strategy:
        case JsonStrategy.Loose:
            return JsonHandler(None, OpenAILooseModeReceiver(marshaler))
        case JsonStrategy.Valid:
            return JsonHandler(OpenAIJsonRequester(), JsonReceiver(marshaler))
        case JsonStrategy.Schematic:
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


class OpenAILooseModeReceiver(
    LooseModeJsonReceiver[
        OpenAIChatCompletionInput,
        OpenAIChatOutput,
        OpenAIChatHistoryEntry,
        OpenAIChatParameters,
    ]
):
    """A loose mode output parser."""

    async def _try_recovering_malformed_json(
        self,
        err: FailedToGenerateValidJsonError,
        json_string: str | None,
        prompt: OpenAIChatCompletionInput,
        kwargs: LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters],
    ) -> tuple[str | None, JSON | None, TJsonModel | None]:
        """Try to recover from a bad JSON error. Null JSON = unable to recover."""
        return (None, None, None)
