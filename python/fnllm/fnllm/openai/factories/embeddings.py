# Copyright (c) 2025 Microsoft Corporation.

"""Factory functions for creating OpenAI LLMs."""

from __future__ import annotations

from typing import TYPE_CHECKING

from fnllm.base.services.cached import Cached
from fnllm.base.services.variable_injector import VariableInjector
from fnllm.events.base import LLMEvents
from fnllm.openai.llm.openai_embeddings_llm import OpenAIEmbeddingsLLMImpl
from fnllm.openai.llm.openai_embeddings_rest_llm import OpenAIEmbeddingsRestLLMImpl
from fnllm.openai.services.openai_embeddings_cache_adapter import (
    OpenAIEmbeddingsCacheAdapter,
)
from fnllm.openai.services.openai_usage_extractor import OpenAIUsageExtractor

from .client import create_openai_client
from .utils import (
    create_backoff_limiter,
    create_limiter,
    create_rate_limiter,
    create_retryer,
)

if TYPE_CHECKING:
    from fnllm.caching.base import Cache
    from fnllm.openai.config import OpenAIConfig
    from fnllm.openai.types.client import OpenAIClient, OpenAIEmbeddingsLLM


def create_openai_embeddings_llm(
    config: OpenAIConfig,
    *,
    client: OpenAIClient | None = None,
    cache: Cache | None = None,
    events: LLMEvents | None = None,
) -> OpenAIEmbeddingsLLM:
    """Create an OpenAI embeddings LLM using the OpenAI SDK."""
    operation = "embedding"
    client = client or create_openai_client(config)
    events = events or LLMEvents()
    backoff_limiter = create_backoff_limiter()
    limiter = create_limiter(config, backoff_limiter)
    return OpenAIEmbeddingsLLMImpl(
        client,
        model=config.model,
        model_parameters=config.embeddings_parameters,
        cached=_create_cached_embeddings_handler(config, cache, events),
        events=events,
        usage_extractor=OpenAIUsageExtractor(),
        variable_injector=VariableInjector(),
        rate_limiter=create_rate_limiter(config=config, events=events, limiter=limiter),
        retryer=create_retryer(
            config=config,
            operation=operation,
            events=events,
            backoff_limiter=backoff_limiter,
        ),
    )


def create_openai_embeddings_rest_llm(
    base_url: str,
    api_key: str,
    model: str,
    *,
    azure: bool = False,
    api_version: str | None = None,
    organization: str | None = None,
    timeout: float = 60.0,
    cache: Cache | None = None,
    events: LLMEvents | None = None,
) -> OpenAIEmbeddingsLLM:
    """Create an OpenAI embeddings LLM using REST API calls."""
    events = events or LLMEvents()

    # Create appropriate config for caching and other services
    from fnllm.openai.config import AzureOpenAIConfig, PublicOpenAIConfig

    if azure:
        config = AzureOpenAIConfig(
            model=model,
            endpoint=base_url,
            organization=organization,
            api_version=api_version,
        )
    else:
        config = PublicOpenAIConfig(
            model=model, base_url=base_url, api_key=api_key, organization=organization
        )

    backoff_limiter = create_backoff_limiter()
    limiter = create_limiter(config, backoff_limiter)

    return OpenAIEmbeddingsRestLLMImpl(
        base_url=base_url,
        api_key=api_key,
        model=model,
        api_version=api_version,
        organization=organization,
        timeout=timeout,
        cached=_create_cached_embeddings_handler(config, cache, events),
        events=events,
        usage_extractor=OpenAIUsageExtractor(),
        variable_injector=VariableInjector(),
        rate_limiter=create_rate_limiter(config=config, events=events, limiter=limiter),
        retryer=create_retryer(
            config=config,
            operation="embedding",
            events=events,
            backoff_limiter=backoff_limiter,
        ),
    )


def _create_cached_embeddings_handler(
    config: OpenAIConfig,
    cache: Cache | None,
    events: LLMEvents,
) -> Cached | None:
    """Create a cache handler."""
    if not cache:
        return None
    return Cached(
        cache=cache,
        events=events,
        cache_adapter=OpenAIEmbeddingsCacheAdapter(
            cache,
            model=config.model,
            global_parameters=config.embeddings_parameters,
        ),
    )
