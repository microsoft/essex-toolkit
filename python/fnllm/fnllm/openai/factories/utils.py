# Copyright (c) 2024 Microsoft Corporation.

"""Helper functions for creating OpenAI LLMs."""

from typing import Any

import tiktoken

from fnllm.events.base import LLMEvents
from fnllm.limiting.base import Limiter
from fnllm.limiting.composite import CompositeLimiter
from fnllm.limiting.concurrency import ConcurrencyLimiter
from fnllm.limiting.rpm import RPMLimiter
from fnllm.limiting.tpm import TPMLimiter
from fnllm.openai.config import OpenAIConfig
from fnllm.openai.llm.services.rate_limiter import OpenAIRateLimiter
from fnllm.openai.llm.services.retryer import OpenAIRetryer
from fnllm.services.rate_limiter import RateLimiter
from fnllm.services.retryer import Retryer


def _get_encoding(encoding_name: str) -> tiktoken.Encoding:
    return tiktoken.get_encoding(encoding_name)


def create_limiter(config: OpenAIConfig) -> Limiter:
    """Create an LLM limiter based on the incoming configuration."""
    limiters = []

    if config.max_concurrency:
        limiters.append(ConcurrencyLimiter.from_max_concurrency(config.max_concurrency))

    if config.requests_per_minute:
        limiters.append(
            RPMLimiter.from_rpm(
                config.requests_per_minute, burst_mode=config.requests_burst_mode
            )
        )

    if config.tokens_per_minute:
        limiters.append(TPMLimiter.from_tpm(config.tokens_per_minute))

    return CompositeLimiter(limiters)


def create_rate_limiter(
    *,
    limiter: Limiter,
    config: OpenAIConfig,
    events: LLMEvents | None,
) -> RateLimiter[Any, Any, Any, Any]:
    """Wraps the LLM to be rate limited."""
    return OpenAIRateLimiter(
        encoder=_get_encoding(config.encoding),
        limiter=limiter,
        events=events,
    )


def create_retryer(
    *,
    config: OpenAIConfig,
    operation: str,
    events: LLMEvents | None,
) -> Retryer[Any, Any, Any, Any]:
    """Wraps the LLM with retry logic."""
    return OpenAIRetryer(
        tag=operation,
        max_retries=config.max_retries,
        max_retry_wait=config.max_retry_wait,
        sleep_on_rate_limit_recommendation=config.sleep_on_rate_limit_recommendation,
        events=events,
    )
