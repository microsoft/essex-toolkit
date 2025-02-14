# Copyright (c) 2024 Microsoft Corporation.
"""OpenAI text chat cache key builder."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from fnllm.base.services.cached import CacheKeyBuilder
from fnllm.openai.types.chat.io import (
    OpenAIChatCompletionInput,
)
from fnllm.openai.utils import build_chat_messages

if TYPE_CHECKING:
    from fnllm.caching import Cache
    from fnllm.openai.types.chat.parameters import OpenAIChatParameters
    from fnllm.types.io import LLMInput


class OpenAITextChatCacheKeyBuilder(CacheKeyBuilder[OpenAIChatCompletionInput]):
    """Cache key builder for OpenAI text chat LLM."""

    def __init__(
        self,
        cache: Cache,
        model: str,
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
