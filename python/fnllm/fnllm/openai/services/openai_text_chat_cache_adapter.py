# Copyright (c) 2024 Microsoft Corporation.
"""OpenAI text chat cache key builder."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from fnllm.base.services.cached import CacheAdapter
from fnllm.openai.types import OpenAIChatCompletionModel
from fnllm.openai.types.chat.io import OpenAIChatCompletionInput, OpenAIChatOutput
from fnllm.openai.utils import build_chat_messages
from fnllm.types.metrics import LLMUsageMetrics

if TYPE_CHECKING:
    from fnllm.caching import Cache
    from fnllm.openai.types.aliases import OpenAIChatModelName
    from fnllm.openai.types.chat.parameters import OpenAIChatParameters
    from fnllm.types.io import LLMInput


class OpenAITextChatCacheAdapter(
    CacheAdapter[OpenAIChatCompletionInput, OpenAIChatOutput]
):
    """Cache key builder for OpenAI text chat LLM."""

    def __init__(
        self,
        cache: Cache,
        model: str | OpenAIChatModelName,
        global_parameters: OpenAIChatParameters | None = None,
    ) -> None:
        """Create a new OpenAITextChatCacheKeyBuilder."""
        self._cache = cache
        self._model = model
        self._global_model_parameters = global_parameters or {}

    def build_cache_key(
        self, prompt: OpenAIChatCompletionInput, kwargs: LLMInput[Any, Any, Any]
    ) -> str:
        """Build a cache key from the prompt and kwargs."""
        name = kwargs.get("name")
        return self._cache.create_key(
            self.get_cache_input_data(prompt, kwargs),
            prefix=f"chat_{name}" if name else "chat",
        )

    def get_cache_input_data(
        self, prompt: OpenAIChatCompletionInput, kwargs: LLMInput[Any, Any, Any]
    ) -> dict[str, Any]:
        """Get the cache metadata from the prompt and kwargs."""
        history = kwargs.get("history", [])
        local_model_parameters = kwargs.get("model_parameters")
        messages, _ = build_chat_messages(prompt, history)
        parameters = self._build_completion_parameters(local_model_parameters)
        return {"messages": messages, "parameters": parameters}

    def _build_completion_parameters(
        self, local_parameters: OpenAIChatParameters | None
    ) -> OpenAIChatParameters:
        params: OpenAIChatParameters = {
            "model": self._model,
            **self._global_model_parameters,
            **(local_parameters or {}),
        }

        return params

    def wrap_output(
        self,
        prompt: OpenAIChatCompletionInput,
        kwargs: LLMInput[Any, Any, Any],
        cached_result: dict[str, Any],
    ) -> OpenAIChatOutput:
        """Get the model to validate the cached result."""
        history = kwargs.get("history", [])
        _, prompt_message = build_chat_messages(prompt, history)
        entry = OpenAIChatCompletionModel.model_validate(cached_result)
        return OpenAIChatOutput(
            raw_input=prompt_message,
            raw_output=entry.choices[0].message,
            content=entry.choices[0].message.content,
            raw_model=entry,
            usage=LLMUsageMetrics(),
        )

    def dump_raw_model(self, output: OpenAIChatOutput) -> dict[str, Any]:
        """Get the model to validate the cached result."""
        return OpenAIChatCompletionModel.model_dump(output.raw_model)
