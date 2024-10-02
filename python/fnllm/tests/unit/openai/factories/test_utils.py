# Copyright 2024 Microsoft Corporation.

"""Tests for openai.factories.utils."""

from typing import cast
from unittest.mock import create_autospec

import pytest
from fnllm.events.base import LLMEvents
from fnllm.limiting.base import Limiter
from fnllm.limiting.composite import CompositeLimiter
from fnllm.limiting.concurrency import ConcurrencyLimiter
from fnllm.limiting.rpm import RPMLimiter
from fnllm.limiting.tpm import TPMLimiter
from fnllm.openai.config import AzureOpenAIConfig, OpenAIConfig
from fnllm.openai.factories.utils import (
    create_limiter,
    create_rate_limiter,
    create_retryer,
)
from fnllm.openai.llm.services.rate_limiter import OpenAIRateLimiter
from fnllm.openai.llm.services.retryer import OpenAIRetryer


@pytest.mark.parametrize("requests_burst_mode", ([True, False]))
def test_create_rate_limited_llm(requests_burst_mode: bool):
    config = AzureOpenAIConfig(
        api_key="key",
        organization="organization",
        api_version="api_version",
        endpoint="endpoint",
        deployment="deployment",
        model="my_models",
        chat_parameters={"temperature": 0.5},
        encoding="p50k_base",
        max_concurrency=5,
        requests_per_minute=100,
        tokens_per_minute=200,
        requests_burst_mode=requests_burst_mode,
    )
    mocked_events = create_autospec(LLMEvents, instance=True)
    limiter = create_limiter(config)

    llm = cast(
        OpenAIRateLimiter,
        create_rate_limiter(
            config=config,
            events=mocked_events,
            limiter=limiter,
        ),
    )

    assert llm._encoding.name == config.encoding
    assert llm._events == mocked_events
    assert llm._limiter == limiter

    _assert_concurrency_tpm_rpm(limiter, config)


def test_create_retrying_llm():
    config = AzureOpenAIConfig(
        api_key="key",
        organization="organization",
        api_version="api_version",
        endpoint="endpoint",
        deployment="deployment",
        model="my_models",
        chat_parameters={"temperature": 0.5},
        encoding="p50k_base",
        max_retries=2,
        max_retry_wait=15,
    )
    mocked_events = create_autospec(LLMEvents, instance=True)
    tag = test_create_retrying_llm.__name__

    llm = cast(
        OpenAIRetryer,
        create_retryer(
            config=config,
            operation=tag,
            events=mocked_events,
        ),
    )

    assert llm._tag == tag
    assert llm._events == mocked_events

    assert llm._max_retries == config.max_retries
    assert llm._max_retry_wait == config.max_retry_wait


def _assert_concurrency_tpm_rpm(limiter: Limiter, config: OpenAIConfig) -> None:
    assert isinstance(limiter, CompositeLimiter)

    # ConcurrencyLimiter
    assert len(limiter._limiters) == 3
    assert isinstance(limiter._limiters[0], ConcurrencyLimiter)
    assert limiter._limiters[0]._semaphore._value == config.max_concurrency

    # RPMLimiter
    assert isinstance(limiter._limiters[1], RPMLimiter)

    if config.requests_burst_mode:
        assert limiter._limiters[1]._limiter.max_rate == config.requests_per_minute
        assert limiter._limiters[1]._limiter.time_period == 60
    else:
        assert limiter._limiters[1]._limiter.max_rate == 1
        if config.requests_per_minute:
            assert (
                limiter._limiters[1]._limiter.time_period
                == 60 / config.requests_per_minute
            )

    # TPMLimiter
    assert isinstance(limiter._limiters[2], TPMLimiter)
    assert limiter._limiters[2]._limiter.max_rate == config.tokens_per_minute
