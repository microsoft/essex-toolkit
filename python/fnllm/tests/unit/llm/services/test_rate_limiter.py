# Copyright 2024 Microsoft Corporation.

"""Tests for llm.features.rate_limiting."""

from asyncio import Semaphore
from unittest.mock import AsyncMock, Mock, call

from aiolimiter import AsyncLimiter
from fnllm.events.base import LLMEvents
from fnllm.limiting.base import Manifest
from fnllm.limiting.composite import CompositeLimiter
from fnllm.limiting.concurrency import ConcurrencyLimiter
from fnllm.limiting.rpm import RPMLimiter
from fnllm.limiting.tpm import TPMLimiter
from fnllm.services.rate_limiter import RateLimiter
from fnllm.types.generics import THistoryEntry, TJsonModel, TModelParameters
from fnllm.types.io import LLMInput, LLMOutput
from fnllm.types.metrics import LLMMetrics, LLMUsageMetrics
from fnllm.types.protocol import LLM


class CustomRateLimiter(RateLimiter[int, str, THistoryEntry, TModelParameters]):
    def _estimate_request_tokens(
        self,
        prompt: int,
        kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters],
    ) -> int:
        # return the prompt itself as the estimate just for testing
        return prompt


async def test_rate_limit_based_on_estimated_request_tokens():
    # mocking limiters to test
    concurrency_base_limiter = AsyncMock(spec=Semaphore)
    concurrency_limiter = ConcurrencyLimiter(concurrency_base_limiter)
    rpm_base_limiter = AsyncMock(spec=AsyncLimiter)
    rpm_limiter = RPMLimiter(rpm_base_limiter)
    tpm_base_limiter = AsyncMock(spec=AsyncLimiter)
    tpm_limiter = TPMLimiter(tpm_base_limiter)
    limiter = CompositeLimiter([concurrency_limiter, rpm_limiter, tpm_limiter])

    # mocking delegate itself and events
    estimated_input_tokens = 10
    expected_output = LLMOutput(
        output="content",
        metrics=LLMMetrics(
            # the total tokens is the same as the estimated_input_tokens
            # --> no post limiting should be triggered
            usage=LLMUsageMetrics(input_tokens=estimated_input_tokens, output_tokens=0)
        ),
    )
    delegate = AsyncMock(spec=LLM, return_value=expected_output)
    events = Mock(spec=LLMEvents)

    limiter = CustomRateLimiter(limiter=limiter, events=events)
    llm = limiter.decorate(delegate)

    # with an estimate of 10 we should call all limiters
    result = await llm(estimated_input_tokens)

    # concurrency has acquire and release with no parameters
    concurrency_base_limiter.acquire.assert_called_once_with()
    concurrency_base_limiter.release.assert_called_once_with()

    # rpm has only acquire with no parameters
    rpm_base_limiter.acquire.assert_called_once_with()

    # tpm has only acquire with parameters
    tpm_base_limiter.acquire.assert_called_once_with(estimated_input_tokens)

    # check limit acquired/released
    events.on_limit_acquired.assert_called_once_with(
        Manifest(request_tokens=estimated_input_tokens)
    )
    events.on_limit_released.assert_called_once_with(
        Manifest(request_tokens=estimated_input_tokens)
    )

    # check post request limiting did not triggered
    events.on_post_limit.assert_not_called()

    # check estimated metrics are populated on result
    assert result.metrics.estimated_input_tokens == estimated_input_tokens


async def test_rate_limit_with_post_limit():
    # mocking limiters to test
    concurrency_base_limiter = AsyncMock(spec=Semaphore)
    concurrency_limiter = ConcurrencyLimiter(concurrency_base_limiter)
    rpm_base_limiter = AsyncMock(spec=AsyncLimiter)
    rpm_limiter = RPMLimiter(rpm_base_limiter)
    tpm_base_limiter = AsyncMock(spec=AsyncLimiter)
    tpm_limiter = TPMLimiter(tpm_base_limiter)
    limiter = CompositeLimiter([concurrency_limiter, rpm_limiter, tpm_limiter])

    # mocking delegate itself and events
    estimated_input_tokens = 10
    tokens_diff = 20
    expected_output = LLMOutput(
        output="content",
        metrics=LLMMetrics(
            # the total tokens is bigger than estimated_input_tokens
            # --> post limiting should be triggered
            usage=LLMUsageMetrics(
                input_tokens=estimated_input_tokens + 10, output_tokens=10
            )
        ),
    )
    delegate = AsyncMock(spec=LLM, return_value=expected_output)
    events = Mock(spec=LLMEvents)

    rate_limiter = CustomRateLimiter(limiter=limiter, events=events)
    llm = rate_limiter.decorate(delegate)

    # with an estimate of 10 we should call all limiters
    result = await llm(estimated_input_tokens)

    # concurrency has acquire and release with no parameters
    concurrency_base_limiter.acquire.assert_called_once_with()
    concurrency_base_limiter.release.assert_called_once_with()

    # rpm has only acquire with no parameters
    rpm_base_limiter.acquire.assert_called_once_with()

    # tpm has only acquire with parameters (there should be a second call with the tokens diff)
    tpm_base_limiter.acquire.assert_has_calls([
        call(estimated_input_tokens),
        call(tokens_diff),
    ])

    # check post request limiting triggered
    events.on_post_limit.assert_called_once()

    # check estimated metrics are populated on result
    assert result.metrics.estimated_input_tokens == estimated_input_tokens
