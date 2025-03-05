# Copyright (c) 2024 Microsoft Corporation.

"""Tests for llm.features.variables_replacing."""

from unittest.mock import ANY, AsyncMock, Mock, call

import pytest
from fnllm.base.config import RetryStrategy
from fnllm.base.services.errors import RetriesExhaustedError
from fnllm.base.services.retryer import Retryer
from fnllm.events.base import LLMEvents
from fnllm.types.io import LLMOutput


class TestError(BaseException): ...


class TestRetryer(Retryer):
    __test__ = False  # this is not a pytest class

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.on_retryable_mock = AsyncMock()

    async def _on_retryable_error(self, error: BaseException) -> None:
        await self.on_retryable_mock(error)


async def test_retrying_llm_passthrough():
    delegate = AsyncMock(return_value=LLMOutput(output="result"))
    events = Mock(spec=LLMEvents)
    retryer = TestRetryer(
        retryable_errors=[],
        events=events,
        retry_strategy=RetryStrategy.EXPONENTIAL_BACKOFF,
        retryable_error_handler=None,
    )
    llm = retryer.decorate(delegate)

    response = await llm("prompt")

    assert response.output == "result"
    assert response.metrics.retry.num_retries == 0
    assert response.metrics.retry.total_time >= 0
    assert len(response.metrics.retry.call_times) == 1

    events.on_try.assert_called_with(1)
    events.on_success.assert_called_once()


def test_retrying_native_strategy():
    events = Mock(spec=LLMEvents)
    with pytest.raises(ValueError):  # noqa PT011
        TestRetryer(
            retryable_errors=[TestError],
            events=events,
            retry_strategy=RetryStrategy.NATIVE,
            retryable_error_handler=None,
        )


async def test_retrying_llm_recovers():
    delegate = AsyncMock()
    delegate.side_effect = [TestError, LLMOutput(output="result")]

    events = Mock(spec=LLMEvents)
    retryer = TestRetryer(
        retryable_errors=[TestError],
        events=events,
        retry_strategy=RetryStrategy.EXPONENTIAL_BACKOFF,
        retryable_error_handler=None,
    )
    llm = retryer.decorate(delegate)

    response = await llm("prompt")

    assert response.output == "result"
    assert response.metrics.retry.num_retries == 1
    assert response.metrics.retry.total_time > 0
    assert len(response.metrics.retry.call_times) == 2

    events.on_try.assert_has_calls([call(1), call(2)])
    events.on_retryable_error.assert_called_with(ANY, 1)


async def test_retrying_llm_raises_retries_exhausted():
    num_calls = 0

    def delegate(*args, **kwargs):
        nonlocal num_calls
        num_calls += 1
        raise TestError

    retryer = TestRetryer(
        retryable_errors=[TestError],
        max_retry_wait=0.1,
        max_retries=5,
        events=LLMEvents(),
        retry_strategy=RetryStrategy.EXPONENTIAL_BACKOFF,
        retryable_error_handler=None,
    )
    llm = retryer.decorate(delegate)

    with pytest.raises(RetriesExhaustedError):
        await llm("prompt")

    assert num_calls == 5


async def test_retrying_llm_emits_error_if_not_retryable():
    delegate = AsyncMock(side_effect=TestError)
    retryer = TestRetryer(
        retryable_errors=[],
        max_retry_wait=0.1,
        max_retries=5,
        events=LLMEvents(),
        retry_strategy=RetryStrategy.EXPONENTIAL_BACKOFF,
        retryable_error_handler=None,
    )
    llm = retryer.decorate(delegate)

    with pytest.raises(TestError):
        await llm("prompt")
