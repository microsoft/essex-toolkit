# Copyright (c) 2025 Microsoft Corporation.

"""The REST API EmbeddingsLLM class."""

from __future__ import annotations

import random
from typing import TYPE_CHECKING, Any, cast

import httpcore
import httpx
from openai.types.create_embedding_response import (CreateEmbeddingResponse,
                                                    Usage)
from openai.types.embedding import Embedding

from fnllm.base.base_llm import BaseLLM
from fnllm.openai.services.openai_usage_extractor import OpenAIUsageExtractor
from fnllm.openai.types.embeddings.io import (OpenAIEmbeddingsInput,
                                              OpenAIEmbeddingsOutput)
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

TRANSPORT = httpx.AsyncHTTPTransport(http2=False, retries=2)

_client: httpx.AsyncClient | None = None


def get_client() -> httpx.AsyncClient:
    global _client
    if _client is None:
        _client = httpx.AsyncClient(
            # Bigger pool= timeout so we don't fail while waiting for a free conn
            timeout=httpx.Timeout(connect=15, read=120, write=120, pool=120.0),
            # Tune limits for your concurrency. Start conservative, adjust up if needed.
            limits=httpx.Limits(
                max_connections=200,           # total across all hosts
                max_keepalive_connections=50,  # idle conns to keep around
                keepalive_expiry=30.0,
            ),
            # If HTTP/2 caused issues earlier, keep it False; otherwise True helps multiplexing.
            http2=False,
            # Lightweight transport-level retries for transient I/O
            transport=httpx.AsyncHTTPTransport(retries=2),
            trust_env=False,  # ignore proxy env vars that can cause weird routes
        )
    return _client


async def close_client() -> None:
    global _client
    if _client is not None:
        await _client.aclose()
        _client = None


class RetryableHttpStatusError(RuntimeError):
    def __init__(self, status_code: int, message: str = ""):
        super().__init__(f"retryable HTTP {status_code}: {message}")
        self.status_code = status_code


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
        timeout: float = 180.0,
        cached: (
            Cached[
                OpenAIEmbeddingsInput,
                OpenAIEmbeddingsOutput,
                None,
                OpenAIEmbeddingsParameters,
            ] | None
        ) = None,
        usage_extractor: OpenAIUsageExtractor[OpenAIEmbeddingsOutput] | None = None,
        variable_injector: VariableInjector | None = None,
        rate_limiter: (
            RateLimiter[
                OpenAIEmbeddingsInput,
                OpenAIEmbeddingsOutput,
                None,
                OpenAIEmbeddingsParameters,
            ] | None
        ) = None,
        retryer: (
            Retryer[
                OpenAIEmbeddingsInput,
                OpenAIEmbeddingsOutput,
                None,
                OpenAIEmbeddingsParameters,
            ] | None
        ) = None,
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
        self._http_client = get_client()

        # # Create HTTP client
        # headers = {
        #     "Authorization": f"Bearer {self._api_key}",
        #     "Content-Type": "application/json",
        # }
        # if self._organization:
        #     headers["OpenAI-Organization"] = self._organization

        # NOTE:
        #  Container environments (especially under throttled or slower network conditions)
        #  have exhibited httpx.ReadError / ReadTimeout when sending large batched embedding
        #  requests. Previously the read timeout was hard-coded to 60s which could be
        #  insufficient for big batches. We now derive timeouts from the user provided
        #  "timeout" argument and add a small internal retry for transient low‑level
        #  read/connection issues (separate from higher-level logical retries) to improve
        #  robustness without masking genuine HTTP status errors.
        # self._http_client = httpx.AsyncClient(
        #     http2=False,
        #     # Lightweight transport-level retries for transient I/O
        #     transport=httpx.AsyncHTTPTransport(retries=2),
        #     trust_env=False,  # ignore proxy env vars that can cause weird routes
        #     timeout=httpx.Timeout(
        #         connect=15,  # keep connection timeout bounded
        #         read=120,
        #         write=120,
        #         pool=60.0,
        #     ),
        #     limits=httpx.Limits(
        #         max_connections=100,
        #         max_keepalive_connections=20,
        #         keepalive_expiry=15.0,  # slightly longer to reduce reconnect churn in containers
        #     ),
        # )

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

        import asyncio

        # Internal lightweight retry for transient transport/read issues. This is
        # intentionally narrow and distinct from the higher-level Retryer which
        # handles semantic / rate / HTTP status retries. We only recreate the
        # connection on specific low-level exceptions that often surface in
        # containerized environments (e.g., httpx.ReadError when peer closes).
        transient_errors: tuple[type[BaseException], ...] = (
            # timeouts
            httpx.TimeoutException,
            httpcore.TimeoutException,

            # read/write
            httpx.ReadError, httpcore.ReadError,
            httpx.WriteError, httpcore.WriteError,

            # connect / pool / proxy
            httpx.ConnectError, httpcore.ConnectError,
            httpx.PoolTimeout, httpcore.PoolTimeout,
            httpx.ProxyError,

            # protocol/reset
            httpx.RemoteProtocolError,
            httpcore.LocalProtocolError, httpcore.RemoteProtocolError,
        )
        max_transient_attempts = 1
        response: httpx.Response | None = None

        for attempt in range(1, max_transient_attempts + 1):
            resp: httpx.Response | None = None
            try:
                # async with self._http_client.stream("POST", url, json=body, headers=headers) as resp:
                #     resp_bytes = await resp.aread()   # fully drain
                #     resp.raise_for_status()
                #     response = httpx.Response(200, content=resp_bytes)
                #     break
                resp = await self._http_client.post(url, json=body, headers=headers)
                if 400 <= resp.status_code:
                    # map only *some* statuses to retryable
                    if resp.status_code in (408, 409, 425, 429, 500, 502, 503, 504):
                        # let outer Retryer decide the long backoff
                        raise RetryableHttpStatusError(
                            resp.status_code,
                            (await resp.aread()).decode("utf-8", errors="replace")
                        )
                    # non-retryable statuses → raise immediately with details
                    try:
                        detail = resp.json()
                    except Exception:
                        detail = await resp.aread()
                    raise RuntimeError(f"HTTP {resp.status_code} from embeddings API: {detail!r}")
                else:
                    response = httpx.Response(200, content=await resp.aread())
                    break
            except transient_errors:  # pragma: no cover - network timing dependent
                # On last attempt, re-raise; else brief backoff and recreate client.
                if attempt == max_transient_attempts:
                    raise
                # Recreate client to avoid potential broken pooled connection.
                try:
                    await self._http_client.aclose()
                except Exception:
                    pass
                self._http_client = httpx.AsyncClient(
                    # transport=TRANSPORT,
                    http2=False,
                    # Lightweight transport-level retries for transient I/O
                    transport=httpx.AsyncHTTPTransport(retries=2),
                    trust_env=False,  # ignore proxy env vars that can cause weird routes
                    timeout=httpx.Timeout(
                        connect=15,  # keep connection timeout bounded
                        read=120,
                        write=120,
                        pool=60.0,
                    ),
                    limits=httpx.Limits(
                        max_connections=100,
                        max_keepalive_connections=32,
                        keepalive_expiry=15.0,  # slightly longer to reduce reconnect churn in containers
                    ),
                )
                # MIN_BACKOFF = 30.0
                # MAX_BACKOFF = 120.0
                # base = min(MAX_BACKOFF, 1.0 * (2 ** (attempt - 1)))   # growth
                # # random in [0.5*base, base], then floor at 30s
                # sleep_s = max(MIN_BACKOFF, random.uniform(base * 0.5, base))
                # await asyncio.sleep(sleep_s)
                # tiny jitter only; outer Retryer owns long waits
                delay = random.uniform(0.1, 1.0)
                await asyncio.sleep(delay)

            except asyncio.CancelledError:
                # don’t mask cancellations; let caller/tenacity see it
                raise
            except httpx.HTTPStatusError:
                # Non-retryable HTTP statuses: propagate the original type
                # (your outer code can catch and format message if desired)
                raise
            except Exception as e:
                # Unknown unexpected error: don't mask httpx/httpcore types;
                # but if it's truly unknown, re-raise original to let Retryer policy decide.
                raise RuntimeError(f"Failed to call embedding model {e}") from e
            finally:
                if resp is not None:
                    await resp.aclose()
        assert response is not None, "Internal error: response not obtained after retries"
        # response.raise_for_status()

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

        # except asyncio.CancelledError as e:
        #     # Explicitly handle cancellation (timeout or parent task cancelled)
        #     raise RuntimeError("Embeddings API call was cancelled (timeout or task cancelled).") from e
        # except httpx.HTTPStatusError as e:
        #     error_detail = ""
        #     try:
        #         error_data = e.response.json()
        #         if "error" in error_data:
        #             error_detail = f": {error_data['error'].get('message', str(error_data['error']))}"
        #     except (ValueError, httpx.DecodingError):
        #         # Could not decode JSON, fallback to response text
        #         error_detail = f": {e.response.text}"

        #     error_msg = (
        #         f"HTTP {e.response.status_code} error from embeddings API{error_detail}"
        #     )
        #     raise RuntimeError(error_msg) from e
        # except Exception as e:
        #     error_msg = f"Failed to call embeddings API: {e!s}"
        #     raise RuntimeError(error_msg) from e

    async def __aenter__(self):
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self._http_client.aclose()
