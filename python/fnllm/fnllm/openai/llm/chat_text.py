# Copyright (c) 2024 Microsoft Corporation.

"""The chat-based LLM implementation."""

from collections.abc import Iterator
from typing import cast

from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam
from typing_extensions import Unpack

from fnllm.base.base import BaseLLM
from fnllm.events.base import LLMEvents
from fnllm.openai.types.aliases import OpenAIChatCompletionModel, OpenAIChatModel
from fnllm.openai.types.chat.io import (
    OpenAIChatCompletionInput,
    OpenAIChatHistoryEntry,
    OpenAIChatOutput,
)
from fnllm.openai.types.chat.parameters import OpenAIChatParameters
from fnllm.openai.types.client import OpenAIClient
from fnllm.services.cache_interactor import CacheInteractor
from fnllm.services.json import JsonHandler
from fnllm.services.rate_limiter import RateLimiter
from fnllm.services.retryer import Retryer
from fnllm.services.variable_injector import VariableInjector
from fnllm.types.generics import TJsonModel
from fnllm.types.io import LLMInput
from fnllm.types.metrics import LLMUsageMetrics

from .services.history_extractor import OpenAIHistoryExtractor
from .services.usage_extractor import OpenAIUsageExtractor
from .utils import build_chat_messages


class OpenAITextChatLLM(
    BaseLLM[
        OpenAIChatCompletionInput,
        OpenAIChatOutput,
        OpenAIChatHistoryEntry,
        OpenAIChatParameters,
    ]
):
    """A chat-based LLM."""

    def __init__(
        self,
        client: OpenAIClient,
        model: str | OpenAIChatModel,
        cache: CacheInteractor,
        *,
        usage_extractor: OpenAIUsageExtractor[OpenAIChatOutput] | None = None,
        history_extractor: OpenAIHistoryExtractor | None = None,
        variable_injector: VariableInjector | None = None,
        rate_limiter: RateLimiter[
            OpenAIChatCompletionInput,
            OpenAIChatOutput,
            OpenAIChatHistoryEntry,
            OpenAIChatParameters,
        ]
        | None = None,
        retryer: Retryer[
            OpenAIChatCompletionInput,
            OpenAIChatOutput,
            OpenAIChatHistoryEntry,
            OpenAIChatParameters,
        ]
        | None = None,
        model_parameters: OpenAIChatParameters | None = None,
        events: LLMEvents | None = None,
        json_handler: JsonHandler[OpenAIChatOutput, OpenAIChatHistoryEntry]
        | None = None,
    ):
        """Create a new OpenAIChatLLM."""
        super().__init__(
            events=events,
            usage_extractor=usage_extractor,
            history_extractor=history_extractor,
            variable_injector=variable_injector,
            retryer=retryer,
            rate_limiter=rate_limiter,
            json_handler=json_handler,
        )

        self._client = client
        self._model = model
        self._global_model_parameters = model_parameters or {}
        self._cache = cache

    def _build_completion_parameters(
        self, local_parameters: OpenAIChatParameters | None
    ) -> OpenAIChatParameters:
        params: OpenAIChatParameters = {
            "model": self._model,
            **self._global_model_parameters,
            **(local_parameters or {}),
        }

        return params

    async def _call_completion_or_cache(
        self,
        name: str | None,
        *,
        messages: list[OpenAIChatHistoryEntry],
        parameters: OpenAIChatParameters,
    ) -> OpenAIChatCompletionModel:
        # TODO: check if we need to remove max_tokens and n from the keys
        return await self._cache.get_or_insert(
            lambda: self._client.chat.completions.create(
                messages=cast(Iterator[ChatCompletionMessageParam], messages),
                **parameters,
            ),
            prefix=f"chat_{name}" if name else "chat",
            key_data={"messages": messages, "parameters": parameters},
            name=name,
            json_model=OpenAIChatCompletionModel,
        )

    async def _execute_llm(
        self,
        prompt: OpenAIChatCompletionInput,
        **kwargs: Unpack[
            LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters]
        ],
    ) -> OpenAIChatOutput:
        name = kwargs.get("name")
        history = kwargs.get("history", [])
        local_model_parameters = kwargs.get("model_parameters")
        messages, prompt_message = build_chat_messages(prompt, history)
        completion_parameters = self._build_completion_parameters(
            local_model_parameters
        )

        completion = await self._call_completion_or_cache(
            name, messages=messages, parameters=completion_parameters
        )

        response = completion.choices[0].message

        return OpenAIChatOutput(
            raw_input=prompt_message,
            raw_output=response,
            content=response.content,
            usage=LLMUsageMetrics(
                input_tokens=completion.usage.prompt_tokens,
                output_tokens=completion.usage.completion_tokens,
            )
            if completion.usage
            else None,
        )
