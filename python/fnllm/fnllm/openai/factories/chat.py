# Copyright (c) 2024 Microsoft Corporation.

"""Factory functions for creating OpenAI LLMs."""

from __future__ import annotations

from typing import TYPE_CHECKING

from fnllm.base.services.cached import Cached
from fnllm.base.services.variable_injector import VariableInjector
from fnllm.events.base import LLMEvents
from fnllm.openai.llm.openai_chat_llm import OpenAIChatLLMImpl
from fnllm.openai.llm.openai_streaming_chat_llm import OpenAIStreamingChatLLMImpl
from fnllm.openai.llm.openai_text_chat_llm import OpenAITextChatLLMImpl
from fnllm.openai.services.openai_history_extractor import (
    OpenAIHistoryExtractor,
)
from fnllm.openai.services.openai_json import create_json_handler
from fnllm.openai.services.openai_text_chat_cache_adapter import (
    OpenAITextChatCacheAdapter,
)
from fnllm.openai.services.openai_tools_parsing import OpenAIParseToolsLLM
from fnllm.openai.services.openai_usage_extractor import (
    OpenAIUsageExtractor,
)

from .client import create_openai_client
from .utils import create_limiter, create_rate_limiter, create_retryer

if TYPE_CHECKING:
    from fnllm.caching.base import Cache
    from fnllm.limiting.base import Limiter
    from fnllm.openai.config import OpenAIConfig
    from fnllm.openai.types.client import (
        OpenAIChatLLM,
        OpenAIClient,
        OpenAIStreamingChatLLM,
        OpenAITextChatLLM,
    )


def create_openai_chat_llm(
    config: OpenAIConfig,
    *,
    client: OpenAIClient | None = None,
    cache: Cache | None = None,
    events: LLMEvents | None = None,
) -> OpenAIChatLLM:
    """Create an OpenAI chat LLM."""
    client = client or create_openai_client(config)
    events = events or LLMEvents()

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
    limiter: Limiter | None,
    cache: Cache | None,
    events: LLMEvents,
) -> OpenAITextChatLLM:
    operation = "chat"
    events = events or LLMEvents()
    result = OpenAITextChatLLMImpl(
        client,
        model=config.model,
        model_parameters=config.chat_parameters,
        cached=_create_cached_chat_handler(config, cache, events),
        events=events,
        json_receiver=create_json_handler(
            config.json_strategy, config.max_json_retries
        ),
        usage_extractor=OpenAIUsageExtractor(),
        history_extractor=OpenAIHistoryExtractor(),
        variable_injector=VariableInjector(),
        retryer=create_retryer(config=config, operation=operation, events=events),
        rate_limiter=create_rate_limiter(config=config, limiter=limiter, events=events),
    )

    return OpenAIParseToolsLLM(result)


def _create_openai_streaming_chat_llm(
    *,
    client: OpenAIClient,
    config: OpenAIConfig,
    limiter: Limiter | None,
    events: LLMEvents,
) -> OpenAIStreamingChatLLM:
    """Create an OpenAI streaming chat LLM."""
    return OpenAIStreamingChatLLMImpl(
        client,
        model=config.model,
        model_parameters=config.chat_parameters,
        events=events,
        emit_usage=config.track_stream_usage,
        variable_injector=VariableInjector(),
        rate_limiter=create_rate_limiter(limiter=limiter, config=config, events=events),
    )


def _create_cached_chat_handler(
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
        cache_adapter=OpenAITextChatCacheAdapter(
            cache,
            model=config.model,
            global_parameters=config.chat_parameters,
        ),
    )
