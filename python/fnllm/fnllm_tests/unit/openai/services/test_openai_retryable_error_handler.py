# Copyright (c) 2024 Microsoft Corporation.
"""Unit tests for the OpenAIRetryableErrorHandler class."""

import asyncio
from typing import Any, cast
from unittest.mock import AsyncMock, Mock

import pytest
from fnllm.base.services.rate_limiter import Manifest
from fnllm.openai.config import OpenAIRateLimitBehavior
from fnllm.openai.services.openai_retryable_error_handler import (
    OpenAIBackoffLimiter,
    OpenAIRetryableErrorHandler,
)
from openai import APIStatusError


# Dummy error to simulate APIStatusError with a retry-after header.
class DummyResponse:
    def __init__(self, retry_after: str):
        self.headers = {"retry-after": retry_after}


class DummyAPIStatusError(APIStatusError):
    def __init__(self, retry_after: str):
        self.response = cast(Any, DummyResponse(retry_after))


async def test_backoff_limiter_acquires_when_unblocked():
    limiter = OpenAIBackoffLimiter()
    # Start with an open state: acquire() should complete immediately
    await limiter.acquire(Manifest())
    # Start a sleep in the limiter that blocks further acquire() calls.
    sleep_task = asyncio.create_task(limiter.sleep_for(0.2))
    # Immediately try to acquire; this task should be blocked.
    acquire_task = asyncio.create_task(limiter.acquire(Manifest()))

    # Assert that acquire_task remains pending (times out) before sleep completes.
    with pytest.raises(asyncio.TimeoutError):
        await asyncio.wait_for(acquire_task, timeout=0.05)

    await sleep_task


async def test_backoff_limiter_blocks_on_sleep():
    limiter = OpenAIBackoffLimiter()
    # Start a sleep in the limiter that blocks further acquire() calls.
    sleep_task = asyncio.create_task(limiter.sleep_for(0.2))
    # Immediately try to acquire; this task should be blocked.
    acquire_task = asyncio.create_task(limiter.acquire(Manifest()))

    # Assert that acquire_task remains pending (times out) before sleep completes.
    with pytest.raises(asyncio.TimeoutError):
        await asyncio.wait_for(acquire_task, timeout=0.05)

    await sleep_task


async def test_backoff_limiter_unblocks_after_sleep():
    limiter = OpenAIBackoffLimiter()
    # Start a sleep in the limiter that blocks further acquire() calls.
    sleep_task = asyncio.create_task(limiter.sleep_for(0.2))
    # Immediately try to acquire; this task should be blocked.
    acquire_task = asyncio.create_task(limiter.acquire(Manifest()))
    await sleep_task
    await asyncio.wait_for(acquire_task, timeout=0.001)


async def test_retryable_error_handler_unknown_error_bypasses_limiter():
    limiter = Mock()
    handler = OpenAIRetryableErrorHandler(
        limiter, strategy=OpenAIRateLimitBehavior.SLEEP
    )
    await handler.__call__(ValueError())


async def test_retryable_error_handler_none_strategy_skips_sleep():
    sleep_for = AsyncMock()
    limiter = Mock()
    limiter.sleep_for = sleep_for
    handler = OpenAIRetryableErrorHandler(
        limiter, strategy=OpenAIRateLimitBehavior.NONE
    )
    await handler.__call__(DummyAPIStatusError("1"))
    sleep_for.assert_not_called()
