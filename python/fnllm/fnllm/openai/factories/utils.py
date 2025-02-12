# Copyright (c) 2024 Microsoft Corporation.

"""Helper functions for creating OpenAI LLMs."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import tiktoken

from fnllm.base.config.retry_strategy import RetryStrategy
from fnllm.base.services.rate_limiter import RateLimiter
from fnllm.base.services.retryer import Retryer
from fnllm.limiting.composite import CompositeLimiter
from fnllm.limiting.concurrency import ConcurrencyLimiter
from fnllm.limiting.rpm import RPMLimiter
from fnllm.limiting.tpm import TPMLimiter
from fnllm.openai.services.openai_retryable_error_handler import (
    OPENAI_RETRYABLE_ERRORS,
    OpenAIRetryableErrorHandler,
)
from fnllm.openai.services.openai_token_estimator import OpenAITokenEstimator

if TYPE_CHECKING:
    from fnllm.events.base import LLMEvents
    from fnllm.limiting.base import Limiter
    from fnllm.openai.config import OpenAIConfig


def _get_encoding(encoding_name: str) -> tiktoken.Encoding:
    return tiktoken.get_encoding(encoding_name)


def create_limiter(config: OpenAIConfig) -> Limiter | None:
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

    if len(limiters) == 0:
        return None
    if len(limiters) == 1:
        return limiters[0]
    return CompositeLimiter(limiters)


def create_rate_limiter(
    *,
    limiter: Limiter | None,
    config: OpenAIConfig,
    events: LLMEvents,
) -> RateLimiter[Any, Any, Any, Any] | None:
    """Wraps the LLM to be rate limited."""
    if limiter is None:
        return None
    encoding = _get_encoding(config.encoding)
    token_estimator = OpenAITokenEstimator(encoding=encoding)
    return RateLimiter(
        estimator=token_estimator,
        limiter=limiter,
        events=events,
    )


def create_retryer(
    *,
    config: OpenAIConfig,
    operation: str,
    events: LLMEvents,
) -> Retryer[Any, Any, Any, Any] | None:
    """Wraps the LLM with retry logic."""
    if config.retry_strategy is RetryStrategy.NATIVE:
        return None
    handler = None
    if config.sleep_on_rate_limit_recommendation:
        handler = OpenAIRetryableErrorHandler()
    return Retryer(
        tag=operation,
        max_retries=config.max_retries,
        max_retry_wait=config.max_retry_wait,
        events=events,
        retry_strategy=config.retry_strategy,
        retryable_errors=OPENAI_RETRYABLE_ERRORS,
        retryable_error_handler=handler,
    )
