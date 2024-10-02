# Copyright (c) 2024 Microsoft Corporation.

"""Tests for llm.features.variables_replacing."""

from unittest.mock import ANY, AsyncMock, call, patch

import pytest
from fnllm.openai.llm.services.retryer import InternalServerError, OpenAIRetryer
from fnllm.services.errors import RetriesExhaustedError
from fnllm.types.io import LLMOutput
from httpx import Request, Response
from openai import RateLimitError


def _rate_limit_error(message: str = "test") -> RateLimitError:
    return RateLimitError(
        message,
        response=Response(
            status_code=400, request=Request(url="http://test", method="POST")
        ),
        body=None,
    )


def _internal_server_error() -> InternalServerError:
    return InternalServerError(
        "test",
        response=Response(
            status_code=500, request=Request(url="http://test", method="POST")
        ),
        body=None,
    )


async def test_retrying_llm_passthrough():
    delegate = AsyncMock(return_value=LLMOutput(output="result"))
    retryer = OpenAIRetryer()
    llm = retryer.decorate(delegate)

    response = await llm("prompt")

    assert response.output == "result"
    assert response.metrics.retry.num_retries == 0
    assert response.metrics.retry.total_time >= 0
    assert len(response.metrics.retry.call_times) == 1


async def test_retrying_llm_recovers():
    delegate = AsyncMock()
    delegate.side_effect = [
        _rate_limit_error(),
        LLMOutput(output="result"),
    ]
    retryer = OpenAIRetryer()
    llm = retryer.decorate(delegate)

    response = await llm("prompt")

    assert response.output == "result"
    assert response.metrics.retry.num_retries == 1
    assert response.metrics.retry.total_time > 0
    assert len(response.metrics.retry.call_times) == 2


async def test_retrying_llm_with_sleep_recovers():
    delegate = AsyncMock()
    delegate.side_effect = [
        _rate_limit_error("Rate limit is exceeded. Try again in 3 seconds."),
        LLMOutput(output="result"),
    ]
    sleep = AsyncMock()

    retryer = OpenAIRetryer(sleep_on_rate_limit_recommendation=True)
    llm = retryer.decorate(delegate)

    with patch("asyncio.sleep", sleep):
        response = await llm("prompt")

    assert response.output == "result"
    assert response.metrics.retry.num_retries == 1
    assert response.metrics.retry.total_time >= 0
    assert len(response.metrics.retry.call_times) == 2

    # second sleep is from tenacity
    sleep.assert_has_calls([call(3), call(ANY)])


async def test_retrying_llm_with_sleep_recovers_on_non_sleep_error():
    delegate = AsyncMock()
    delegate.side_effect = [
        _internal_server_error(),
        LLMOutput(output="result"),
    ]

    retryer = OpenAIRetryer(sleep_on_rate_limit_recommendation=True)
    llm = retryer.decorate(delegate)

    response = await llm("prompt")

    assert response.output == "result"
    assert response.metrics.retry.num_retries == 1
    assert response.metrics.retry.total_time > 0
    assert len(response.metrics.retry.call_times) == 2


async def test_retrying_llm_raises_retries_exhausted():
    delegate = AsyncMock(side_effect=_rate_limit_error())
    retryer = OpenAIRetryer(
        max_retry_wait=0.1,
        max_retries=5,
    )
    llm = retryer.decorate(delegate)

    with pytest.raises(RetriesExhaustedError):
        await llm("prompt")

    assert delegate.call_count == 5
