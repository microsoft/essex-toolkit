# Copyright (c) 2024 Microsoft Corporation.

"""The chat-based LLM implementation."""

from __future__ import annotations

from collections.abc import Iterator
from typing import TYPE_CHECKING, Any, cast

from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam
from typing_extensions import Unpack

from fnllm.base.base import BaseLLM
from fnllm.caching import Cache
from fnllm.openai.types.aliases import OpenAIChatCompletionModel, OpenAIChatModel
from fnllm.openai.types.chat.io import (
    OpenAIChatCompletionInput,
    OpenAIChatHistoryEntry,
    OpenAIChatOutput,
)
from fnllm.openai.types.chat.parameters import OpenAIChatParameters
from fnllm.types.metrics import LLMUsageMetrics

from .services.history_extractor import OpenAIHistoryExtractor
from .services.usage_extractor import OpenAIUsageExtractor
from .utils import build_chat_messages

if TYPE_CHECKING:
    from fnllm.events.base import LLMEvents
    from fnllm.openai.types.client import OpenAIClient
    from fnllm.services.cache_interactor import Cached
    from fnllm.services.json import JsonHandler
    from fnllm.services.rate_limiter import RateLimiter
    from fnllm.services.retryer import Retryer
    from fnllm.services.variable_injector import VariableInjector
    from fnllm.types.generics import TJsonModel
    from fnllm.types.io import LLMInput


class OpenAITextChatLLMImpl(
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
        cache: Cache | None = None,
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

    def child(self, name: str) -> Any:
        """Create a child LLM."""
        return OpenAITextChatLLMImpl(
            self._client,
            self._model,
            self._cache.child(name),
            events=self.events,
            usage_extractor=cast(
                OpenAIUsageExtractor[OpenAIChatOutput], self._usage_extractor
            ),
            history_extractor=cast(OpenAIHistoryExtractor, self._history_extractor),
            variable_injector=self._variable_injector,
            rate_limiter=self._rate_limiter,
            retryer=self._retryer,
            model_parameters=self._global_model_parameters,
            json_handler=self._json_handler,
        )

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
        prompt: OpenAIChatCompletionInput,
        **kwargs: Unpack[
            LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters]
        ],
    ) -> Cached[OpenAIChatCompletionModel]:
        # TODO: check if we need to remove max_tokens and n from the keys
        name = kwargs.get("name")
        bypass_cache = kwargs.get("bypass_cache", False)
        local_model_parameters = kwargs.get("model_parameters")
        parameters = self._build_completion_parameters(local_model_parameters)
        messages = kwargs.get("messages", [])
        return await self._cache.get_or_insert(
            lambda: self._client.chat.completions.create(
                messages=cast(Iterator[ChatCompletionMessageParam], messages),
                **parameters,
            ),
            prefix=f"chat_{name}" if name else "chat",
            key_data={"messages": messages, "parameters": parameters},
            name=name,
            json_model=OpenAIChatCompletionModel,
            bypass_cache=bypass_cache,
        )

    async def _execute_llm(
        self,
        prompt: OpenAIChatCompletionInput,
        **kwargs: Unpack[
            LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters]
        ],
    ) -> OpenAIChatOutput:
        history = kwargs.get("history", [])
        messages, prompt_message = build_chat_messages(prompt, history)
        local_model_parameters = kwargs.get("model_parameters")
        parameters = self._build_completion_parameters(local_model_parameters)
        completion = await self._client.chat.completions.create(
            messages=cast(Iterator[ChatCompletionMessageParam], messages),
            **parameters,
        )

        if self._cache is not None and not kwargs.get("bypass_cache"):
            cache_key = self._create_cache_key(messages, **kwargs)
            await self._cache.set(
                cache_key,
                completion.model_dump(),
                {"messages": messages, "parameters": parameters},
            )

        usage: LLMUsageMetrics | None = None
        if completion.usage:
            usage = LLMUsageMetrics(
                input_tokens=completion.usage.prompt_tokens,
                output_tokens=completion.usage.completion_tokens,
            )

        return self._create_response(completion, prompt_message, usage)

    async def _try_execute_cached(
        self,
        prompt: OpenAIChatCompletionInput,
        **kwargs: Unpack[
            LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters]
        ],
    ) -> OpenAIChatOutput:
        if self._cache is None or kwargs.get("bypass_cache") is True:
            return None

        name = kwargs.get("name")
        history = kwargs.get("history", [])
        messages, prompt_message = build_chat_messages(prompt, history)
        key = self._create_cache_key(messages, **kwargs)
        result = await self._cache.get(key)
        if result is not None:
            entry = OpenAIChatCompletionModel.model_validate(result)
            await self._events.on_cache_hit(key, name)
            return self._create_response(entry, prompt_message)

        await self._events.on_cache_miss(key, name)
        return None

    def _create_cache_key(
        self,
        messages: list[OpenAIChatHistoryEntry],
        **kwargs: Unpack[
            LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters]
        ],
    ) -> str:
        local_model_parameters = kwargs.get("model_parameters")
        parameters = self._build_completion_parameters(local_model_parameters)
        return self._cache.create_key(
            {"messages": messages, "parameters": parameters}, prefix="chat"
        )

    def _create_response(
        self,
        model: OpenAIChatCompletionModel,
        prompt: OpenAIChatCompletionInput,
        usage: LLMUsageMetrics | None = None,
    ) -> OpenAIChatOutput:
        completion = model.choices[0].message
        usage = usage or LLMUsageMetrics()
        return OpenAIChatOutput(
            raw_input=prompt,
            raw_output=completion,
            content=completion.content,
            usage=usage,
        )
