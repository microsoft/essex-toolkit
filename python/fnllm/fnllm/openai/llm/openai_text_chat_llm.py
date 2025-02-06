# Copyright (c) 2024 Microsoft Corporation.

"""The chat-based LLM implementation."""

from __future__ import annotations

from collections.abc import Iterator
from typing import TYPE_CHECKING, Any, cast

from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam

from fnllm.base.base_llm import BaseLLM
from fnllm.base.config import JsonStrategy
from fnllm.openai.services.openai_history_extractor import (
    OpenAIHistoryExtractor,
)
from fnllm.openai.services.openai_usage_extractor import (
    OpenAIUsageExtractor,
)
from fnllm.openai.types.aliases import OpenAIChatCompletionModel, OpenAIChatModel
from fnllm.openai.types.chat.io import (
    OpenAIChatCompletionInput,
    OpenAIChatHistoryEntry,
    OpenAIChatOutput,
)
from fnllm.openai.types.chat.parameters import OpenAIChatParameters
from fnllm.openai.utils import build_chat_messages
from fnllm.types.metrics import LLMUsageMetrics

if TYPE_CHECKING:
    from fnllm.base.services.json import JsonReceiver
    from fnllm.base.services.rate_limiter import RateLimiter
    from fnllm.base.services.retryer import Retryer
    from fnllm.base.services.variable_injector import VariableInjector
    from fnllm.caching import Cache
    from fnllm.events.base import LLMEvents
    from fnllm.openai.types.client import OpenAIClient
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
        json_receiver: JsonReceiver[
            OpenAIChatCompletionInput,
            OpenAIChatOutput,
            OpenAIChatHistoryEntry,
            OpenAIChatParameters,
        ]
        | None,
        json_strategy: JsonStrategy = JsonStrategy.VALID,
    ):
        """Create a new OpenAIChatLLM."""
        super().__init__(
            events=events,
            cache=cache,
            usage_extractor=usage_extractor,
            history_extractor=history_extractor,
            variable_injector=variable_injector,
            retryer=retryer,
            json_receiver=json_receiver,
            rate_limiter=rate_limiter,
        )

        self._client = client
        self._model = model
        self._global_model_parameters = model_parameters or {}
        self._cache = cache
        self._json_strategy = json_strategy
        self._json_receiver = json_receiver

    def child(self, name: str) -> Any:
        """Create a child LLM."""
        if self._cache is None:
            return self
        return OpenAITextChatLLMImpl(
            self._client,
            self._model,
            cache=self._cache.child(name),
            json_receiver=self._json_receiver,
            events=self.events,
            usage_extractor=cast(
                OpenAIUsageExtractor[OpenAIChatOutput], self._usage_extractor
            ),
            history_extractor=cast(OpenAIHistoryExtractor, self._history_extractor),
            variable_injector=self._variable_injector,
            rate_limiter=self._rate_limiter,
            retryer=self._retryer,
            model_parameters=self._global_model_parameters,
            json_strategy=self._json_strategy,
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

    async def _execute_llm(
        self,
        prompt: OpenAIChatCompletionInput,
        kwargs: LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters],
    ) -> OpenAIChatOutput:
        history = kwargs.get("history", [])
        bypass_cache = kwargs.get("bypass_cache", False)
        messages, prompt_message = build_chat_messages(prompt, history)
        local_model_parameters = kwargs.get("model_parameters")
        parameters = self._build_completion_parameters(local_model_parameters)

        completion = await self._client.chat.completions.create(
            messages=cast(Iterator[ChatCompletionMessageParam], messages),
            **parameters,
        )

        result = completion.choices[0].message
        usage: LLMUsageMetrics | None = None
        if completion.usage:
            usage = LLMUsageMetrics(
                input_tokens=completion.usage.prompt_tokens,
                output_tokens=completion.usage.completion_tokens,
            )

        if not bypass_cache and self._cache is not None:
            key = self._get_cache_key(prompt, kwargs)
            await self._cache.set(
                key,
                completion.model_dump(),
                {"input": {"messages": messages, "parameters": parameters}},
            )
        return OpenAIChatOutput(
            raw_input=prompt_message,
            raw_output=result,
            content=result.content,
            usage=usage or LLMUsageMetrics(),
        )

    async def _try_execute_cached(
        self,
        prompt: OpenAIChatCompletionInput,
        kwargs: LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters],
    ) -> OpenAIChatOutput | None:
        """Attempt to execute the LLM using a cached result."""
        if self._cache is None:
            return None

        name = kwargs.get("name")
        history = kwargs.get("history", [])
        _, prompt_message = build_chat_messages(prompt, history)
        key = self._get_cache_key(prompt, kwargs)

        cached_value = await self._cache.get(key)
        if cached_value is None:
            await self._events.on_cache_miss(key, name)
            return None

        entry = OpenAIChatCompletionModel.model_validate(cached_value)
        await self._events.on_cache_hit(key, name)
        return OpenAIChatOutput(
            raw_input=prompt_message,
            raw_output=entry.choices[0].message,
            content=entry.choices[0].message.content,
            usage=LLMUsageMetrics(),
        )

    def _get_cache_key(
        self,
        prompt: OpenAIChatCompletionInput,
        kwargs: LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters],
    ) -> str:
        if self._cache is None:
            msg = "Cache is not enabled."
            raise ValueError(msg)
        name = kwargs.get("name")
        history = kwargs.get("history", [])
        local_model_parameters = kwargs.get("model_parameters")

        messages, _ = build_chat_messages(prompt, history)
        parameters = self._build_completion_parameters(local_model_parameters)
        return self._cache.create_key(
            {"messages": messages, "parameters": parameters},
            prefix=f"chat_{name}" if name else "chat",
        )

    def _rewrite_input(
        self,
        prompt: OpenAIChatCompletionInput,
        kwargs: LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters],
    ) -> tuple[
        OpenAIChatCompletionInput,
        LLMInput[TJsonModel, OpenAIChatHistoryEntry, OpenAIChatParameters],
    ]:
        prompt, kwargs = super()._rewrite_input(prompt, kwargs)
        if self.is_json_mode(kwargs) and self._json_strategy == JsonStrategy.VALID:
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
