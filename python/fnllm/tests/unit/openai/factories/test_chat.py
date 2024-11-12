# Copyright 2024 Microsoft Corporation.

"""Tests for openai.factories.chat."""

from typing import TYPE_CHECKING
from unittest.mock import ANY, create_autospec, patch

import pytest
from fnllm.caching.base import Cache
from fnllm.events.base import LLMEvents
from fnllm.openai.config import AzureOpenAIConfig
from fnllm.openai.factories.chat import create_openai_chat_llm
from fnllm.openai.llm.chat_text import OpenAITextChatLLMImpl
from fnllm.openai.llm.features.tools_parsing import OpenAIParseToolsLLM
from fnllm.openai.llm.services.history_extractor import OpenAIHistoryExtractor
from fnllm.openai.llm.services.rate_limiter import OpenAIRateLimiter
from fnllm.openai.llm.services.retryer import OpenAIRetryer
from fnllm.openai.llm.services.usage_extractor import OpenAIUsageExtractor
from fnllm.services.variable_injector import VariableInjector

if TYPE_CHECKING:
    from fnllm import ChatLLM


def test_oai_chat_llm_assignable_to_chat_llm():
    config = AzureOpenAIConfig(
        api_key="key",
        organization="organization",
        api_version="api_version",
        endpoint="endpoint",
        deployment="deployment",
        model="my_models",
        chat_parameters={"temperature": 0.5},
    )
    llm: ChatLLM = create_openai_chat_llm(config)
    assert llm is not None
    assert llm.child("test") is not None


def test_create_openai_chat_llm():
    config = AzureOpenAIConfig(
        api_key="key",
        organization="organization",
        api_version="api_version",
        endpoint="endpoint",
        deployment="deployment",
        model="my_models",
        chat_parameters={"temperature": 0.5},
    )
    mocked_cache = create_autospec(Cache, instance=True)
    mocked_events = create_autospec(LLMEvents, instance=True)

    with (
        patch.object(
            OpenAITextChatLLMImpl,
            "__init__",
            return_value=None,
        ) as new_chat_llm,
        patch.object(
            VariableInjector, "__init__", return_value=None
        ) as new_variable_injector,
        patch.object(
            OpenAIParseToolsLLM, "__init__", return_value=None
        ) as new_parse_tools_llm,
        patch.object(
            OpenAIHistoryExtractor, "__init__", return_value=None
        ) as new_history_extractor,
        patch.object(
            OpenAIUsageExtractor, "__init__", return_value=None
        ) as new_usage_extractor,
        patch.object(
            OpenAIRateLimiter, "__init__", return_value=None
        ) as new_rate_limit_llm,
        patch.object(OpenAIRetryer, "__init__", return_value=None) as new_retrying_llm,
    ):
        client = create_openai_chat_llm(
            config, cache=mocked_cache, events=mocked_events
        )

        # check config has been forwarded
        new_chat_llm.assert_called_with(
            ANY,
            model=config.model,
            model_parameters=config.chat_parameters,
            cache=ANY,
            events=mocked_events,
            usage_extractor=ANY,
            history_extractor=ANY,
            variable_injector=ANY,
            retryer=ANY,
            rate_limiter=ANY,
            json_handler=ANY,
        )

        # check delegates have been called
        new_variable_injector.assert_called()
        new_parse_tools_llm.assert_called()
        new_history_extractor.assert_called()
        new_usage_extractor.assert_called()
        new_rate_limit_llm.assert_called()
        new_retrying_llm.assert_called()

        assert client is not None


def test_invalid_encoding_should_raise():
    config = AzureOpenAIConfig(
        api_key="key",
        organization="organization",
        api_version="api_version",
        endpoint="endpoint",
        deployment="deployment",
        model="my_models",
        chat_parameters={"temperature": 0.5},
        encoding="invalid",
        max_retries=2,
        max_retry_wait=15,
    )

    with pytest.raises(ValueError):  # noqa: PT011
        create_openai_chat_llm(config)
