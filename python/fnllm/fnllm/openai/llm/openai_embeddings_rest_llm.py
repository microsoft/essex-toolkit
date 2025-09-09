# Copyright (c) 2025 Microsoft Corporation.

"""The REST API EmbeddingsLLM class."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, cast

import httpx
from openai.types.create_embedding_response import CreateEmbeddingResponse, Usage
from openai.types.embedding import Embedding

from fnllm.base.base_llm import BaseLLM
from fnllm.openai.services.openai_usage_extractor import OpenAIUsageExtractor
from fnllm.openai.types.embeddings.io import (
    OpenAIEmbeddingsInput,
    OpenAIEmbeddingsOutput,
)
from fnllm.openai.types.embeddings.parameters import OpenAIEmbeddingsParameters
from fnllm.openai.utils import is_reasoning_model
from fnllm.types.metrics import LLMUsageMetrics

if TYPE_CHECKING:
    from fnllm.base.services.cached import Cached
    from fnllm.base.services.rate_limiter import RateLimiter
    from fnllm.base.services.retryer import Retryer
    from fnllm.base.services.variable_injector import VariableInjector
    from fnllm.events.base import LLMEvents
    from fnllm.openai.types.aliases import OpenAIEmbeddingModelName
    from fnllm.types.io import LLMInput


class OpenAIEmbeddingsRestLLMImpl(
    BaseLLM[
        OpenAIEmbeddingsInput, OpenAIEmbeddingsOutput, None, OpenAIEmbeddingsParameters
    ],
):
    """A text-embedding generator LLM using REST API calls."""

    def __init__(
        self,
        base_url: str,
        api_key: str,
        model: str | OpenAIEmbeddingModelName,
        *,
        api_version: str | None = None,
        organization: str | None = None,
        timeout: float = 60.0,
        cached: Cached[
            OpenAIEmbeddingsInput,
            OpenAIEmbeddingsOutput,
            None,
            OpenAIEmbeddingsParameters,
        ]
        | None = None,
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
        """Create a new OpenAIEmbeddingsRestLLM."""
        super().__init__(
            events=events,
            usage_extractor=usage_extractor,
            variable_injector=variable_injector,
            rate_limiter=rate_limiter,
            retryer=retryer,
            cached=cached,
        )

        self._base_url = base_url.rstrip("/")
        self._api_key = api_key
        self._model = model
        self._api_version = api_version
        self._organization = organization
        self._timeout = timeout
        self._cached = cached
        self._global_model_parameters = model_parameters or {}

        # Create HTTP client
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
        }
        if self._organization:
            headers["OpenAI-Organization"] = self._organization

        self._http_client = httpx.AsyncClient(
            headers=headers,
            timeout=self._timeout,
        )

    def child(self, name: str) -> OpenAIEmbeddingsRestLLMImpl:
        """Create a child LLM."""
        if not self._cached:
            return self
        return OpenAIEmbeddingsRestLLMImpl(
            self._base_url,
            self._api_key,
            self._model,
            api_version=self._api_version,
            organization=self._organization,
            timeout=self._timeout,
            cached=self._cached.child(name),
            usage_extractor=cast(
                OpenAIUsageExtractor[OpenAIEmbeddingsOutput], self._usage_extractor
            ),
            variable_injector=self._variable_injector,
            rate_limiter=self._rate_limiter,
            retryer=self._retryer,
            model_parameters=self._global_model_parameters,
            events=self._events,
        )

    def is_reasoning_model(self) -> bool:
        """Return whether the LLM uses a reasoning model."""
        return is_reasoning_model(self._model)

    def _build_embeddings_parameters(
        self, local_parameters: OpenAIEmbeddingsParameters | None
    ) -> OpenAIEmbeddingsParameters:
        params: OpenAIEmbeddingsParameters = {
            **self._global_model_parameters,
            **(local_parameters or {}),
        }

        return params

    def _build_url(self) -> str:
        """Build the API endpoint URL."""
        if self._api_version:
            # Azure OpenAI format
            return f"{self._base_url}/openai/deployments/{self._model}/embeddings?api-version={self._api_version}"
        if "microsoft" in self._base_url:
            # qwen model api format
            return f"{self._base_url}/{self._model}/v1/embeddings"
        # OpenAI format
        return f"{self._base_url}/v1/embeddings"

    def _prepare_request_body(
        self,
        prompt: OpenAIEmbeddingsInput,
        embeddings_parameters: OpenAIEmbeddingsParameters,
    ) -> dict[str, Any]:
        """Prepare the request body for the REST API call."""
        body = {
            "input": prompt,
            **embeddings_parameters,
        }

        # Remove None values and model parameter for Azure deployments
        if self._api_version and "model" in body:
            del body["model"]  # Model is in the URL for Azure

        return {k: v for k, v in body.items() if v is not None}

    def _build_headers(self) -> dict[str, str]:
        """Build headers for the REST API call."""
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
        }
        if self._organization:
            headers["OpenAI-Organization"] = self._organization
        return headers

    @staticmethod
    def _to_create_embedding_response(
        response_data: dict[str, Any], fallback_model: str
    ) -> CreateEmbeddingResponse:
        model = response_data.get("model", fallback_model).replace(
            "/vllm-workspace/", ""
        )
        data = [
            Embedding(embedding=d["embedding"], index=d["index"], object="embedding")
            for d in response_data["data"]
        ]

        u = response_data.get("usage", {})
        usage = Usage(
            prompt_tokens=int(u.get("prompt_tokens", 0)),
            total_tokens=int(u.get("total_tokens", 0)),
        )

        return CreateEmbeddingResponse(
            data=data,
            model=model,
            object=response_data.get("object", "list"),
            usage=usage,
        )

    async def _execute_llm(
        self, prompt: OpenAIEmbeddingsInput, kwargs: LLMInput
    ) -> OpenAIEmbeddingsOutput:
        local_model_parameters = kwargs.get("model_parameters")
        embeddings_parameters = self._build_embeddings_parameters(
            local_model_parameters
        )

        url = self._build_url()
        body = self._prepare_request_body(prompt, embeddings_parameters)
        headers = self._build_headers()

        try:
            response = await self._http_client.post(url, headers=headers, json=body)
            response.raise_for_status()

            response_data = response.json()
            headers = response.headers

            # Parse usage information
            usage: LLMUsageMetrics | None = None
            if response_data.get("usage"):
                usage_data = response_data.get("usage")
                usage = LLMUsageMetrics(
                    input_tokens=usage_data.get("prompt_tokens", 0),
                )

            # Extract embeddings
            embeddings = [item["embedding"] for item in response_data["data"]]

            # Create a mock raw_model structure similar to OpenAI SDK response
            # We'll cast this to Any to avoid type issues
            raw_model = self._to_create_embedding_response(response_data, self._model)

            return OpenAIEmbeddingsOutput(
                raw_input=prompt,
                raw_output=response_data["data"],
                embeddings=embeddings,
                usage=usage or LLMUsageMetrics(),
                raw_model=raw_model,
                headers=headers,
            )

        except httpx.HTTPStatusError as e:
            error_detail = ""
            try:
                error_data = e.response.json()
                if "error" in error_data:
                    error_detail = f": {error_data['error'].get('message', str(error_data['error']))}"
            except (ValueError, httpx.DecodingError):
                # Could not decode JSON, fallback to response text
                error_detail = f": {e.response.text}"

            error_msg = (
                f"HTTP {e.response.status_code} error from embeddings API{error_detail}"
            )
            raise RuntimeError(error_msg) from e
        except Exception as e:
            error_msg = f"Failed to call embeddings API: {e!s}"
            raise RuntimeError(error_msg) from e

    async def __aenter__(self):
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self._http_client.aclose()
