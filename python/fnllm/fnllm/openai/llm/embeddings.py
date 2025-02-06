# Copyright (c) 2024 Microsoft Corporation.

"""The EmbeddingsLLM class."""

from __future__ import annotations

from typing import TYPE_CHECKING, cast

from typing_extensions import Unpack

from fnllm.base.base import BaseLLM
from fnllm.openai.types.aliases import OpenAICreateEmbeddingResponseModel
from fnllm.openai.types.embeddings.io import (
    OpenAIEmbeddingsInput,
    OpenAIEmbeddingsOutput,
)
from fnllm.openai.types.embeddings.parameters import OpenAIEmbeddingsParameters
from fnllm.types.metrics import LLMUsageMetrics

from .services.usage_extractor import OpenAIUsageExtractor

if TYPE_CHECKING:
    from fnllm.caching.base import Cache
    from fnllm.events.base import LLMEvents
    from fnllm.openai.types.client import OpenAIClient
    from fnllm.services.rate_limiter import RateLimiter
    from fnllm.services.retryer import Retryer
    from fnllm.services.variable_injector import VariableInjector
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
        cache: Cache,
        *,
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
        return OpenAIEmbeddingsLLMImpl(
            self._client,
            self._model,
            self._cache.child(name),
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
        self, prompt: OpenAIEmbeddingsInput, **kwargs: Unpack[LLMInput]
    ) -> OpenAIEmbeddingsOutput:
        local_model_parameters = kwargs.get("model_parameters")
        parameters = self._build_embeddings_parameters(local_model_parameters)
        result = await self._client.embeddings.create(input=prompt, **parameters)

        usage: LLMUsageMetrics | None = None
        if result.usage:
            usage = LLMUsageMetrics(
                input_tokens=result.usage.prompt_tokens,
            )

        if self._cache is not None and not kwargs.get("bypass_cache"):
            await self._cache.set(
                self._create_cache_key(prompt, **kwargs),
                result.model_dump(),
                {"input": prompt, "parameters": parameters},
            )

        return self._create_response(result, prompt, usage)

    def _create_cache_key(self, prompt: str, **kwargs: Unpack[LLMInput]) -> str:
        local_model_parameters = kwargs.get("model_parameters")
        parameters = self._build_embeddings_parameters(local_model_parameters)
        return self._cache.create_key(
            {"input": prompt, "parameters": parameters}, prefix="chat"
        )

    async def _try_execute_cached(
        self, prompt: OpenAIEmbeddingsInput, **kwargs: Unpack[LLMInput]
    ) -> OpenAIEmbeddingsOutput:
        if self._cache is None or kwargs.get("bypass_cache"):
            return None

        name = kwargs.get("name")
        cache_key = self._create_cache_key(prompt, **kwargs)

        result = await self._cache.get(cache_key)
        if result is not None:
            result = OpenAICreateEmbeddingResponseModel.model_validate(result)
            self._on_cache_hit(cache_key, name)
            return self._create_response(result, prompt)

        self._events.on_cache_miss(cache_key, name)
        return None

    def _create_response(
        self,
        model: OpenAICreateEmbeddingResponseModel,
        prompt: OpenAIEmbeddingsInput,
        usage: LLMUsageMetrics | None = None,
    ) -> OpenAIEmbeddingsOutput:
        usage = usage or LLMUsageMetrics()
        return OpenAIEmbeddingsOutput(
            raw_input=prompt,
            raw_output=model.data,
            embeddings=[d.embedding for d in model.data],
            usage=usage or LLMUsageMetrics(),
        )
