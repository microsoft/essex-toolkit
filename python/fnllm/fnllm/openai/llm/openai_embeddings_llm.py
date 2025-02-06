# Copyright (c) 2024 Microsoft Corporation.

"""The EmbeddingsLLM class."""

from __future__ import annotations

from typing import TYPE_CHECKING, cast

from fnllm.base.base_llm import BaseLLM
from fnllm.openai.services.openai_usage_extractor import (
    OpenAIUsageExtractor,
)
from fnllm.openai.types.aliases import OpenAICreateEmbeddingResponseModel
from fnllm.openai.types.embeddings.io import (
    OpenAIEmbeddingsInput,
    OpenAIEmbeddingsOutput,
)
from fnllm.openai.types.embeddings.parameters import OpenAIEmbeddingsParameters
from fnllm.types.metrics import LLMUsageMetrics

if TYPE_CHECKING:
    from fnllm.base.services.rate_limiter import RateLimiter
    from fnllm.base.services.retryer import Retryer
    from fnllm.base.services.variable_injector import VariableInjector
    from fnllm.caching import Cache
    from fnllm.events.base import LLMEvents
    from fnllm.openai.types.client import OpenAIClient
    from fnllm.types.io import LLMInput


class OpenAIEmbeddingsLLMImpl(
    BaseLLM[
        OpenAIEmbeddingsInput, OpenAIEmbeddingsOutput, None, OpenAIEmbeddingsParameters
    ],
):
    """A text-embedding generator LLM."""

    def __init__(
        self,
        client: OpenAIClient,
        model: str,
        *,
        cache: Cache | None = None,
        usage_extractor: OpenAIUsageExtractor[OpenAIEmbeddingsOutput] | None = None,
        variable_injector: VariableInjector | None = None,
        rate_limiter: RateLimiter[
            OpenAIEmbeddingsInput,
            OpenAIEmbeddingsOutput,
            None,
            OpenAIEmbeddingsParameters,
        ]
        | None = None,
        retryer: Retryer[
            OpenAIEmbeddingsInput,
            OpenAIEmbeddingsOutput,
            None,
            OpenAIEmbeddingsParameters,
        ]
        | None = None,
        model_parameters: OpenAIEmbeddingsParameters | None = None,
        events: LLMEvents | None = None,
    ):
        """Create a new OpenAIEmbeddingsLLM."""
        super().__init__(
            events=events,
            usage_extractor=usage_extractor,
            variable_injector=variable_injector,
            rate_limiter=rate_limiter,
            retryer=retryer,
        )

        self._client = client
        self._model = model
        self._cache = cache
        self._global_model_parameters = model_parameters or {}

    def child(self, name: str) -> OpenAIEmbeddingsLLMImpl:
        """Create a child LLM."""
        if not self._cache:
            return self
        return OpenAIEmbeddingsLLMImpl(
            self._client,
            self._model,
            cache=self._cache.child(name),
            usage_extractor=cast(
                OpenAIUsageExtractor[OpenAIEmbeddingsOutput], self._usage_extractor
            ),
            variable_injector=self._variable_injector,
            rate_limiter=self._rate_limiter,
            retryer=self._retryer,
            model_parameters=self._global_model_parameters,
            events=self._events,
        )

    def _build_embeddings_parameters(
        self, local_parameters: OpenAIEmbeddingsParameters | None
    ) -> OpenAIEmbeddingsParameters:
        params: OpenAIEmbeddingsParameters = {
            "model": self._model,
            **self._global_model_parameters,
            **(local_parameters or {}),
        }

        return params

    async def _execute_llm(
        self, prompt: OpenAIEmbeddingsInput, kwargs: LLMInput
    ) -> OpenAIEmbeddingsOutput:
        local_model_parameters = kwargs.get("model_parameters")
        bypass_cache = kwargs.get("bypass_cache", False)
        parameters = self._build_embeddings_parameters(local_model_parameters)

        embeddings_parameters = self._build_embeddings_parameters(
            local_model_parameters
        )

        result = await self._client.embeddings.create(
            input=prompt,
            **embeddings_parameters,
        )
        usage: LLMUsageMetrics | None = None
        if result.usage:
            usage = LLMUsageMetrics(
                input_tokens=result.usage.prompt_tokens,
            )

        if not bypass_cache and self._cache is not None:
            key = self._get_cache_key(prompt, kwargs)
            await self._cache.set(
                key,
                result.model_dump(),
                {
                    "input": {"input": prompt, "parameters": parameters},
                },
            )

        return OpenAIEmbeddingsOutput(
            raw_input=prompt,
            raw_output=result.data,
            embeddings=[d.embedding for d in result.data],
            usage=usage or LLMUsageMetrics(),
        )

    async def _try_execute_cached(
        self, prompt: OpenAIEmbeddingsInput, kwargs: LLMInput
    ) -> OpenAIEmbeddingsOutput | None:
        """Attempt to execute the LLM using a cached result."""
        if self._cache is None:
            return None
        name = kwargs.get("name")
        key = self._get_cache_key(prompt, kwargs)
        cached_value = await self._cache.get(key)
        if cached_value is None:
            await self._events.on_cache_miss(key, name)
            return None

        entry = OpenAICreateEmbeddingResponseModel.model_validate(cached_value)
        await self._events.on_cache_hit(key, name)
        return OpenAIEmbeddingsOutput(
            raw_input=prompt,
            raw_output=entry.data,
            embeddings=[d.embedding for d in entry.data],
            usage=LLMUsageMetrics(),
        )

    def _get_cache_key(self, prompt: OpenAIEmbeddingsInput, kwargs: LLMInput) -> str:
        if self._cache is None:
            msg = "Cache is not enabled."
            raise ValueError(msg)
        local_model_parameters = kwargs.get("model_parameters")
        name = kwargs.get("name")
        parameters = self._build_embeddings_parameters(local_model_parameters)
        return self._cache.create_key(
            {"input": prompt, "parameters": parameters},
            prefix=f"embeddings_{name}" if name else "embeddings",
        )
