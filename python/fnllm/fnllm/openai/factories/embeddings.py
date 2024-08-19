# Copyright (c) 2024 Microsoft Corporation.

"""Factory functions for creating OpenAI LLMs."""

from fnllm.caching.base import Cache
from fnllm.llm.events.base import LLMEvents
from fnllm.llm.services.cache_interactor import CacheInteractor
from fnllm.llm.services.variable_injector import VariableInjector
from fnllm.openai.config import OpenAIConfig
from fnllm.openai.llm.embeddings import OpenAIEmbeddingsLLM
from fnllm.openai.llm.services.usage_extractor import OpenAIUsageExtractor
from fnllm.openai.types.client import OpenAIClient, OpenAIEmbeddingsLLMInstance

from .client import create_openai_client
from .utils import create_limiter, rate_limiter, retryer


def create_openai_embeddings_llm(
    config: OpenAIConfig,
    *,
    client: OpenAIClient | None = None,
    cache: Cache | None = None,
    events: LLMEvents | None = None,
) -> OpenAIEmbeddingsLLMInstance:
    """Create an OpenAI embeddings LLM."""
    operation = "embedding"

    if client is None:
        client = create_openai_client(config)

    limiter = create_limiter(config)
    return OpenAIEmbeddingsLLM(
        client,
        model=config.model,
        model_parameters=config.embeddings_parameters,
        cache=CacheInteractor(events, cache),
        events=events,
        usage_extractor=OpenAIUsageExtractor(),
        variable_injector=VariableInjector(),
        rate_limiter=rate_limiter(config=config, events=events, limiter=limiter),
        retryer=retryer(config=config, operation=operation, events=events),
    )
