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
from fnllm.limiting.types import LimitReconciliation
from fnllm.openai.services.openai_retryable_error_handler import (
    OPENAI_RETRYABLE_ERRORS,
    OpenAIBackoffLimiter,
    OpenAIRetryableErrorHandler,
)
from fnllm.openai.services.openai_token_estimator import OpenAITokenEstimator

if TYPE_CHECKING:
    from httpx import Headers

    from fnllm.events.base import LLMEvents
    from fnllm.limiting.base import Limiter
    from fnllm.openai.config import OpenAIConfig
    from fnllm.types.io import LLMOutput


def _get_encoding(encoding_name: str) -> tiktoken.Encoding:
    return tiktoken.get_encoding(encoding_name)


def _get_header_value(output: LLMOutput[Any, Any, Any], header_name: str) -> Any:
    if hasattr(output.output, "headers"):
        headers: Headers = output.output.headers
        result = headers.get(header_name, None)
        return int(result) if result is not None else None
    return None


def _tpm_reconciler(output: LLMOutput[Any, Any, Any]) -> LimitReconciliation:
    return LimitReconciliation(
        limit=_get_header_value(output, "x-ratelimit-limit-tokens"),
        remaining=_get_header_value(output, "x-ratelimit-remaining-tokens"),
    )


def _rpm_reconciler(output: LLMOutput[Any, Any, Any]) -> LimitReconciliation:
    return LimitReconciliation(
        limit=_get_header_value(output, "x-ratelimit-limit-requests"),
        remaining=_get_header_value(output, "x-ratelimit-remaining-requests"),
    )


def create_backoff_limiter() -> OpenAIBackoffLimiter:
    """Create an LLM limiter based on the incoming configuration."""
    return OpenAIBackoffLimiter()


def create_limiter(
    config: OpenAIConfig,
    backoff_limiter: OpenAIBackoffLimiter | None,
) -> Limiter | None:
    """Create an LLM limiter based on the incoming configuration."""
    limiters = []

    if backoff_limiter is not None:
        limiters.append(backoff_limiter)

    rpm = config.requests_per_minute
    tpm = config.tokens_per_minute

    if config.max_concurrency:
        limiters.append(ConcurrencyLimiter.from_max_concurrency(config.max_concurrency))

    if rpm is not None:
        # If RPM is set to 0, enable dynamic RPM
        reconciler = None
        if rpm == "auto":
            rpm = 1
            reconciler = _rpm_reconciler

        limiters.append(
            RPMLimiter.from_rpm(
                rpm,
                burst_mode=config.requests_burst_mode,
                reconciler=reconciler,
            )
        )

    if tpm is not None:
        # If RPM is set to 0, enable dynamic RPM
        reconciler = None
        if tpm == "auto":
            tpm = 1
            reconciler = _tpm_reconciler

        limiters.append(
            TPMLimiter.from_tpm(
                tpm,
                reconciler=reconciler,
            )
        )

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
    backoff_limiter: OpenAIBackoffLimiter | None,
) -> Retryer[Any, Any, Any, Any] | None:
    """Wraps the LLM with retry logic."""
    if config.retry_strategy is RetryStrategy.NATIVE:
        return None
    handler = None
    if backoff_limiter is not None:
        handler = OpenAIRetryableErrorHandler(
            backoff_limiter, config.rate_limit_behavior
        )
    return Retryer(
        tag=operation,
        max_retries=config.max_retries,
        max_retry_wait=config.max_retry_wait,
        events=events,
        retry_strategy=config.retry_strategy,
        retryable_errors=OPENAI_RETRYABLE_ERRORS,
        retryable_error_handler=handler,
    )
