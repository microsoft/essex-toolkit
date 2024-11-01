# Copyright (c) 2024 Microsoft Corporation.

"""The fnllm package, containing utilities to interact with LLMs."""

from .caching import Cache
from .config import Config, JsonStrategy
from .events import LLMEvents, LLMEventsLogger, LLMUsageTracker
from .limiting import (
    CompositeLimiter,
    ConcurrencyLimiter,
    Limiter,
    NoopLimiter,
    RPMLimiter,
    TPMLimiter,
)
from .tools import LLMTool
from .types import (
    LLM,
    ChatLLM,
    ChatLLMInput,
    ChatLLMOutput,
    EmbeddingsLLM,
    EmbeddingsLLMInput,
    EmbeddingsLLMOutput,
    LLMInput,
    LLMMetrics,
    LLMOutput,
    LLMRetryMetrics,
    LLMUsageMetrics,
)
from .utils.sliding_window import SlidingWindow, SlidingWindowEntry

__all__ = [
    "LLM",
    "Cache",
    "ChatLLM",
    "ChatLLMInput",
    "ChatLLMOutput",
    "ChatLLMOutput",
    "CompositeLimiter",
    "ConcurrencyLimiter",
    "Config",
    "EmbeddingsLLM",
    "EmbeddingsLLMInput",
    "EmbeddingsLLMOutput",
    "JsonStrategy",
    "LLMEvents",
    "LLMEventsLogger",
    "LLMInput",
    "LLMMetrics",
    "LLMOutput",
    "LLMRetryMetrics",
    "LLMTool",
    "LLMUsageMetrics",
    "LLMUsageTracker",
    "Limiter",
    "NoopLimiter",
    "RPMLimiter",
    "SlidingWindow",
    "SlidingWindowEntry",
    "TPMLimiter",
]
