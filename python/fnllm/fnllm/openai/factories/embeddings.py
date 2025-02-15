# Copyright (c) 2024 Microsoft Corporation.

"""Factory functions for creating OpenAI LLMs."""

from __future__ import annotations

from typing import TYPE_CHECKING

from fnllm.base.services.cached import Cached
from fnllm.base.services.variable_injector import VariableInjector
from fnllm.events.base import LLMEvents
from fnllm.openai.llm.openai_embeddings_llm import OpenAIEmbeddingsLLMImpl
from fnllm.openai.services.openai_embeddings_cache_adapter import (
    OpenAIEmbeddingsCacheAdapter,
)
from fnllm.openai.services.openai_usage_extractor import (
    OpenAIUsageExtractor,
)

from .client import create_openai_client
from .utils import create_limiter, create_rate_limiter, create_retryer

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
    """Create an OpenAI embeddings LLM."""
    operation = "embedding"
    client = client or create_openai_client(config)
    events = events or LLMEvents()
    limiter = create_limiter(config)
    return OpenAIEmbeddingsLLMImpl(
        client,
        model=config.model,
        model_parameters=config.embeddings_parameters,
        cached=_create_cached_embeddings_handler(config, cache, events),
        events=events,
        usage_extractor=OpenAIUsageExtractor(),
        variable_injector=VariableInjector(),
        rate_limiter=create_rate_limiter(config=config, events=events, limiter=limiter),
        retryer=create_retryer(config=config, operation=operation, events=events),
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
