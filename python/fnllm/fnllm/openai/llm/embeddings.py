# Copyright (c) 2024 Microsoft Corporation.

"""The EmbeddingsLLM class."""

from typing_extensions import Unpack

from fnllm.base.base import BaseLLM
from fnllm.events.base import LLMEvents
from fnllm.openai.types.aliases import OpenAICreateEmbeddingResponseModel
from fnllm.openai.types.client import OpenAIClient
from fnllm.openai.types.embeddings.io import (
    OpenAIEmbeddingsInput,
    OpenAIEmbeddingsOutput,
)
from fnllm.openai.types.embeddings.parameters import OpenAIEmbeddingsParameters
from fnllm.services.cache_interactor import CacheInteractor
from fnllm.services.rate_limiter import RateLimiter
from fnllm.services.retryer import Retryer
from fnllm.services.variable_injector import VariableInjector
from fnllm.types.io import LLMInput
from fnllm.types.metrics import LLMUsageMetrics

from .services.usage_extractor import OpenAIUsageExtractor


class OpenAIEmbeddingsLLM(
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
    ) -> OpenAICreateEmbeddingResponseModel:
        # TODO: check if we need to remove max_tokens and n from the keys
        return await self._cache.get_or_insert(
            lambda: self._client.embeddings.create(
                input=prompt,
                **parameters,
            ),
            prefix=f"embeddings_{name}" if name else "embeddings",
            key_data={"input": prompt, "parameters": parameters},
            name=name,
            json_model=OpenAICreateEmbeddingResponseModel,
        )

    async def _execute_llm(
        self, prompt: OpenAIEmbeddingsInput, **kwargs: Unpack[LLMInput]
    ) -> OpenAIEmbeddingsOutput:
        name = kwargs.get("name")
        local_model_parameters = kwargs.get("model_parameters")

        embeddings_parameters = self._build_embeddings_parameters(
            local_model_parameters
        )

        response = await self._call_embeddings_or_cache(
            name,
            prompt=prompt,
            parameters=embeddings_parameters,
        )

        return OpenAIEmbeddingsOutput(
            raw_input=prompt,
            raw_output=response.data,
            embeddings=[d.embedding for d in response.data],
            usage=LLMUsageMetrics(
                input_tokens=response.usage.prompt_tokens,
            )
            if response.usage
            else None,
        )
