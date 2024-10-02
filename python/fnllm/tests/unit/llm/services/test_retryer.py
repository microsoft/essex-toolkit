# Copyright (c) 2024 Microsoft Corporation.

"""Tests for llm.features.variables_replacing."""

from unittest.mock import ANY, AsyncMock, Mock, call

import pytest
from fnllm.events.base import LLMEvents
from fnllm.services.errors import RetriesExhaustedError
from fnllm.services.retryer import Retryer
from fnllm.types.io import LLMOutput


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
    retryer = TestRetryer(retryable_errors=[], events=events)
    llm = retryer.decorate(delegate)

    response = await llm("prompt")

    assert response.output == "result"
    assert response.metrics.retry.num_retries == 0
    assert response.metrics.retry.total_time >= 0
    assert len(response.metrics.retry.call_times) == 1

    events.on_try.assert_called_with(1)
    events.on_success.assert_called_once()


async def test_retrying_llm_recovers():
    delegate = AsyncMock()
    delegate.side_effect = [ValueError, LLMOutput(output="result")]

    events = Mock(spec=LLMEvents)
    retryer = TestRetryer(retryable_errors=[ValueError], events=events)
    llm = retryer.decorate(delegate)

    response = await llm("prompt")

    assert response.output == "result"
    assert response.metrics.retry.num_retries == 1
    assert response.metrics.retry.total_time > 0
    assert len(response.metrics.retry.call_times) == 2

    events.on_try.assert_has_calls([call(1), call(2)])
    events.on_retryable_error.assert_called_with(ANY, 1)
    retryer.on_retryable_mock.assert_called_once()


async def test_retrying_llm_raises_retries_exhausted():
    delegate = AsyncMock(side_effect=ValueError)
    retryer = TestRetryer(
        retryable_errors=[ValueError],
        max_retry_wait=0.1,
        max_retries=5,
    )
    llm = retryer.decorate(delegate)

    with pytest.raises(RetriesExhaustedError):
        await llm("prompt")

    assert delegate.call_count == 5
    assert retryer.on_retryable_mock.call_count == 5


async def test_retrying_llm_emits_error_if_not_retryable():
    class TestError(BaseException): ...

    delegate = AsyncMock(side_effect=TestError)
    retryer = TestRetryer(
        retryable_errors=[],
        max_retry_wait=0.1,
        max_retries=5,
    )
    llm = retryer.decorate(delegate)

    with pytest.raises(TestError):
        await llm("prompt")
