# Copyright (c) 2024 Microsoft Corporation.

"""Factory functions for creating OpenAI LLMs."""

from fnllm.caching.base import Cache
from fnllm.limiting.base import Limiter
from fnllm.llm.events.base import LLMEvents
from fnllm.llm.services.cache_interactor import CacheInteractor
from fnllm.llm.services.variable_injector import VariableInjector
from fnllm.openai.config import OpenAIConfig
from fnllm.openai.llm.chat import OpenAIChatLLMImpl
from fnllm.openai.llm.chat_streaming import OpenAIStreamingChatLLM
from fnllm.openai.llm.chat_text import OpenAITextChatLLM
from fnllm.openai.llm.features.tools_parsing import OpenAIParseToolsLLM
from fnllm.openai.llm.services.history_extractor import OpenAIHistoryExtractor
from fnllm.openai.llm.services.json import create_json_handler
from fnllm.openai.llm.services.usage_extractor import OpenAIUsageExtractor
from fnllm.openai.types.client import (
    OpenAIChatLLM,
    OpenAIClient,
    OpenAIStreamingChatLLMInstance,
    OpenAITextChatLLMInstance,
)

from .client import create_openai_client
from .utils import create_limiter, rate_limiter, retryer


def create_openai_chat_llm(
    config: OpenAIConfig,
    *,
    client: OpenAIClient | None = None,
    cache: Cache | None = None,
    events: LLMEvents | None = None,
) -> OpenAIChatLLM:
    """Create an OpenAI chat LLM."""
    if client is None:
        client = create_openai_client(config)

    limiter = create_limiter(config)

    text_chat_llm = _create_openai_text_chat_llm(
        client=client,
        config=config,
        cache=cache,
        events=events,
        limiter=limiter,
    )
    streaming_chat_llm = _create_openai_streaming_chat_llm(
        client=client,
        config=config,
        events=events,
        limiter=limiter,
    )
    return OpenAIChatLLMImpl(
        text_chat_llm=text_chat_llm,
        streaming_chat_llm=streaming_chat_llm,
    )


def _create_openai_text_chat_llm(
    *,
    client: OpenAIClient,
    config: OpenAIConfig,
    limiter: Limiter,
    cache: Cache | None,
    events: LLMEvents | None,
) -> OpenAITextChatLLMInstance:
    operation = "chat"
    result = OpenAITextChatLLM(
        client,
        model=config.model,
        model_parameters=config.chat_parameters,
        cache=CacheInteractor(events, cache),
        events=events,
        json_handler=create_json_handler(config.json_strategy),
        usage_extractor=OpenAIUsageExtractor(),
        history_extractor=OpenAIHistoryExtractor(),
        variable_injector=VariableInjector(),
        retryer=retryer(config=config, operation=operation, events=events),
        rate_limiter=rate_limiter(config=config, limiter=limiter, events=events),
    )

    return OpenAIParseToolsLLM(result)


def _create_openai_streaming_chat_llm(
    *,
    client: OpenAIClient,
    config: OpenAIConfig,
    limiter: Limiter,
    events: LLMEvents | None,
) -> OpenAIStreamingChatLLMInstance:
    """Create an OpenAI streaming chat LLM."""
    return OpenAIStreamingChatLLM(
        client,
        model=config.model,
        model_parameters=config.chat_parameters,
        events=events,
        emit_usage=config.track_stream_usage,
        variable_injector=VariableInjector(),
        rate_limiter=rate_limiter(limiter=limiter, config=config, events=events),
    )
