# Copyright (c) 2024 Microsoft Corporation.

"""The EmbeddingsLLM class."""

from __future__ import annotations

from typing import TYPE_CHECKING, cast

from typing_extensions import Unpack

from fnllm.base.base_llm import BaseLLM
from fnllm.openai.services.usage_extractor import OpenAIUsageExtractor
from fnllm.openai.types.aliases import OpenAICreateEmbeddingResponseModel
from fnllm.openai.types.embeddings.io import (
    OpenAIEmbeddingsInput,
    OpenAIEmbeddingsOutput,
)
from fnllm.openai.types.embeddings.parameters import OpenAIEmbeddingsParameters
from fnllm.types.metrics import LLMUsageMetrics

if TYPE_CHECKING:
    from fnllm.base.services.cache_interactor import Cached, CacheInteractor
    from fnllm.base.services.rate_limiter import RateLimiter
    from fnllm.base.services.retryer import Retryer
    from fnllm.base.services.variable_injector import VariableInjector
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
        cache: CacheInteractor,
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

    async def _call_embeddings_or_cache(
        self,
        name: str | None,
        *,
        prompt: OpenAIEmbeddingsInput,
        parameters: OpenAIEmbeddingsParameters,
        bypass_cache: bool,
    ) -> Cached[OpenAICreateEmbeddingResponseModel]:
        # TODO: check if we need to remove max_tokens and n from the keys
        return await self._cache.get_or_insert(
            lambda: self._client.embeddings.create(
                input=prompt,
                **parameters,
            ),
            prefix=f"embeddings_{name}" if name else "embeddings",
            key_data={"input": prompt, "parameters": parameters},
            name=name,
            bypass_cache=bypass_cache,
            json_model=OpenAICreateEmbeddingResponseModel,
        )

    async def _execute_llm(
        self, prompt: OpenAIEmbeddingsInput, **kwargs: Unpack[LLMInput]
    ) -> OpenAIEmbeddingsOutput:
        name = kwargs.get("name")
        local_model_parameters = kwargs.get("model_parameters")
        bypass_cache = kwargs.get("bypass_cache", False)

        embeddings_parameters = self._build_embeddings_parameters(
            local_model_parameters
        )

        response = await self._call_embeddings_or_cache(
            name,
            prompt=prompt,
            parameters=embeddings_parameters,
            bypass_cache=bypass_cache,
        )
        result = response.value
        usage: LLMUsageMetrics | None = None
        if result.usage and not response.hit:
            usage = LLMUsageMetrics(
                input_tokens=result.usage.prompt_tokens,
            )

        return OpenAIEmbeddingsOutput(
            raw_input=prompt,
            raw_output=result.data,
            embeddings=[d.embedding for d in result.data],
            usage=usage or LLMUsageMetrics(),
        )
