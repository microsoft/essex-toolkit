# Copyright (c) 2024 Microsoft Corporation.

"""The chat-based LLM implementation."""

from __future__ import annotations

from collections.abc import Iterator
from typing import TYPE_CHECKING, Any, cast

from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam

from fnllm.base.base_llm import BaseLLM
from fnllm.base.config import JsonStrategy
from fnllm.base.services.errors import InvalidLLMResultError
from fnllm.openai.services.openai_history_extractor import (
    OpenAIHistoryExtractor,
)
from fnllm.openai.services.openai_usage_extractor import (
    OpenAIUsageExtractor,
)
from fnllm.openai.types.chat.io import (
    OpenAIChatCompletionInput,
    OpenAIChatHistoryEntry,
    OpenAIChatOutput,
)
from fnllm.openai.types.chat.parameters import OpenAIChatParameters
from fnllm.openai.utils import build_chat_messages, is_reasoning_model
from fnllm.types.metrics import LLMUsageMetrics

if TYPE_CHECKING:
    from fnllm.base.services.cached import Cached
    from fnllm.base.services.json import JsonReceiver
    from fnllm.base.services.rate_limiter import RateLimiter
    from fnllm.base.services.retryer import Retryer
    from fnllm.base.services.variable_injector import VariableInjector
    from fnllm.events.base import LLMEvents
    from fnllm.openai.types.aliases import OpenAIChatModelName
    from fnllm.openai.types.client import OpenAIClient
    from fnllm.types.generics import TJsonModel
    from fnllm.types.io import LLMInput


class OpenAINoChoicesAvailableError(InvalidLLMResultError):
    """No choices returned from OpenAI chat completion."""

    def __init__(self) -> None:
        """Init method definition."""
        super().__init__("No choices returned from OpenAI chat completion.")


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
        model: str | OpenAIChatModelName,
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
        cached: Cached[
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
            usage_extractor=usage_extractor,
            history_extractor=history_extractor,
            variable_injector=variable_injector,
            retryer=retryer,
            json_receiver=json_receiver,
            rate_limiter=rate_limiter,
            cached=cached,
        )

        self._client = client
        self._model = model
        self._global_model_parameters = model_parameters or {}
        self._cached = cached
        self._json_strategy = json_strategy
        self._json_receiver = json_receiver

    def child(self, name: str) -> Any:
        """Create a child LLM."""
        if self._cached is None:
            return self
        return OpenAITextChatLLMImpl(
            self._client,
            self._model,
            cached=self._cached.child(name),
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
    ) -> OpenAIChatOutput:
        history = kwargs.get("history", [])
        messages, prompt_message = build_chat_messages(prompt, history)
        local_model_parameters = kwargs.get("model_parameters")
        parameters = self._build_completion_parameters(local_model_parameters)

        completion = await self._client.chat.completions.create(
            messages=cast(Iterator[ChatCompletionMessageParam], messages),
            **parameters,
        )

        if not completion.choices or len(completion.choices) == 0:
            raise OpenAINoChoicesAvailableError

        result = completion.choices[0].message
        usage: LLMUsageMetrics | None = None
        if completion.usage:
            usage = LLMUsageMetrics(
                input_tokens=completion.usage.prompt_tokens,
                output_tokens=completion.usage.completion_tokens,
            )

        return OpenAIChatOutput(
            raw_input=prompt_message,
            raw_output=result,
            content=result.content,
            raw_model=completion,
            usage=usage or LLMUsageMetrics(),
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
