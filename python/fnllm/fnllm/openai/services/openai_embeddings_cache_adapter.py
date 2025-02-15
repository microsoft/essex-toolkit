# Copyright (c) 2024 Microsoft Corporation.
"""OpenAI text chat cache key builder."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from fnllm.base.services.cached import CacheAdapter
from fnllm.openai.types.aliases import (
    OpenAICreateEmbeddingResponseModel,
    OpenAIEmbeddingModelName,
)
from fnllm.openai.types.embeddings.io import (
    OpenAIEmbeddingsInput,
    OpenAIEmbeddingsOutput,
)
from fnllm.types.metrics import LLMUsageMetrics

if TYPE_CHECKING:
    from fnllm.caching import Cache
    from fnllm.openai.types.embeddings.parameters import OpenAIEmbeddingsParameters
    from fnllm.types.io import LLMInput


class OpenAIEmbeddingsCacheAdapter(
    CacheAdapter[OpenAIEmbeddingsInput, OpenAIEmbeddingsOutput]
):
    """Cache key builder for OpenAI text chat LLM."""

    def __init__(
        self,
        cache: Cache,
        model: str | OpenAIEmbeddingModelName,
        global_parameters: OpenAIEmbeddingsParameters | None = None,
    ) -> None:
        """Create a new OpenAIEmbeddingsCacheKeyBuilder."""
        self._cache = cache
        self._model = model
        self._global_model_parameters = global_parameters or {}

    def build_cache_key(
        self, prompt: OpenAIEmbeddingsInput, kwargs: LLMInput[Any, Any, Any]
    ) -> str:
        """Build a cache key from the prompt and kwargs."""
        name = kwargs.get("name")
        return self._cache.create_key(
            self.get_cache_input_data(prompt, kwargs),
            prefix=f"embeddings_{name}" if name else "embeddings",
        )

    def get_cache_input_data(
        self, prompt: OpenAIEmbeddingsInput, kwargs: LLMInput[Any, Any, Any]
    ) -> dict[str, Any]:
        """Get the cache metadata from the prompt and kwargs."""
        local_model_parameters = kwargs.get("model_parameters")
        parameters = self._build_embeddings_parameters(local_model_parameters)
        return {"input": prompt, "parameters": parameters}

    def _build_embeddings_parameters(
        self, local_parameters: OpenAIEmbeddingsParameters | None
    ) -> OpenAIEmbeddingsParameters:
        params: OpenAIEmbeddingsParameters = {
            "model": self._model,
            **self._global_model_parameters,
            **(local_parameters or {}),
        }

        return params

    def wrap_output(
        self,
        prompt: OpenAIEmbeddingsInput,
        kwargs: LLMInput[Any, Any, Any],
        cached_result: dict[str, Any],
    ) -> OpenAIEmbeddingsOutput:
        """Get the model to validate the cached result."""
        entry = OpenAICreateEmbeddingResponseModel.model_validate(cached_result)
        return OpenAIEmbeddingsOutput(
            raw_input=prompt,
            raw_output=entry.data,
            raw_model=entry,
            embeddings=[d.embedding for d in entry.data],
            usage=LLMUsageMetrics(),
        )

    def dump_raw_model(self, output: OpenAIEmbeddingsOutput) -> dict[str, Any]:
        """Get the model to validate the cached result."""
        return OpenAICreateEmbeddingResponseModel.model_dump(output.raw_model)
