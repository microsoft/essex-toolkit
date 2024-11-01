# Copyright (c) 2024 Microsoft Corporation.

"""Factory functions for creating OpenAI LLMs."""

from fnllm.caching.base import Cache
from fnllm.events.base import LLMEvents
from fnllm.openai.config import OpenAIConfig
from fnllm.openai.llm.embeddings import OpenAIEmbeddingsLLMImpl
from fnllm.openai.llm.services.usage_extractor import OpenAIUsageExtractor
from fnllm.openai.types.client import OpenAIClient, OpenAIEmbeddingsLLM
from fnllm.services.cache_interactor import CacheInteractor
from fnllm.services.variable_injector import VariableInjector

from .client import create_openai_client
from .utils import create_limiter, create_rate_limiter, create_retryer


def create_openai_embeddings_llm(
    config: OpenAIConfig,
    *,
    client: OpenAIClient | None = None,
    cache: Cache | None = None,
    events: LLMEvents | None = None,
) -> OpenAIEmbeddingsLLM:
    """Create an OpenAI embeddings LLM."""
    operation = "embedding"

    if client is None:
        client = create_openai_client(config)

    limiter = create_limiter(config)
    return OpenAIEmbeddingsLLMImpl(
        client,
        model=config.model,
        model_parameters=config.embeddings_parameters,
        cache=CacheInteractor(events, cache),
        events=events,
        usage_extractor=OpenAIUsageExtractor(),
        variable_injector=VariableInjector(),
        rate_limiter=create_rate_limiter(config=config, events=events, limiter=limiter),
        retryer=create_retryer(config=config, operation=operation, events=events),
    )
