# Copyright 2024 Microsoft Corporation.

"""Tests for openai.factories.chat."""

from typing import TYPE_CHECKING
from unittest.mock import ANY, create_autospec, patch

from fnllm.base.services.cache_interactor import CacheInteractor
from fnllm.base.services.rate_limiter import RateLimiter
from fnllm.base.services.retryer import Retryer
from fnllm.base.services.variable_injector import VariableInjector
from fnllm.caching.base import Cache
from fnllm.events.base import LLMEvents
from fnllm.openai.config import AzureOpenAIConfig
from fnllm.openai.factories.embeddings import create_openai_embeddings_llm
from fnllm.openai.llm.openai_embeddings_llm import OpenAIEmbeddingsLLMImpl
from fnllm.openai.services.openai_usage_extractor import (
    OpenAIUsageExtractor,
)

if TYPE_CHECKING:
    from fnllm.types import EmbeddingsLLM


def test_oai_embedding_llm_assignable_to_embedding_llm():
    config = AzureOpenAIConfig(
        api_key="key",
        organization="organization",
        api_version="api_version",
        endpoint="endpoint",
        deployment="deployment",
        model="my_models",
    )
    llm: EmbeddingsLLM = create_openai_embeddings_llm(config)
    assert llm is not None


def test_create_openai_embeddings_llm():
    config = AzureOpenAIConfig(
        api_key="key",
        organization="organization",
        api_version="api_version",
        endpoint="endpoint",
        deployment="deployment",
        model="my_models",
        embeddings_parameters={"user": "some_user"},
    )
    mocked_cache = create_autospec(Cache, instance=True)
    mocked_events = create_autospec(LLMEvents, instance=True)

    with (
        patch.object(
            OpenAIEmbeddingsLLMImpl,
            "__init__",
            return_value=None,
        ) as new_embeddings_llm,
        patch.object(
            CacheInteractor, "__init__", return_value=None
        ) as new_cache_interactor,
        patch.object(
            VariableInjector, "__init__", return_value=None
        ) as new_variable_injector,
        patch.object(
            OpenAIUsageExtractor, "__init__", return_value=None
        ) as new_usage_extractor,
        patch.object(RateLimiter, "__init__", return_value=None) as new_rate_limit_llm,
        patch.object(Retryer, "__init__", return_value=None) as new_retrying_llm,
    ):
        client = create_openai_embeddings_llm(
            config, cache=mocked_cache, events=mocked_events
        )

        new_cache_interactor.assert_called_with(mocked_events, mocked_cache)

        # check config has been forwarded
        new_embeddings_llm.assert_called_once_with(
            ANY,
            model=config.model,
            model_parameters=config.embeddings_parameters,
            cache=ANY,
            events=mocked_events,
            usage_extractor=ANY,
            variable_injector=ANY,
            retryer=ANY,
            rate_limiter=ANY,
        )

        # check delegates have been called
        new_variable_injector.assert_called_once()
        new_usage_extractor.assert_called_once()
        new_rate_limit_llm.assert_called_once()
        new_retrying_llm.assert_called_once()

        assert client is not None
