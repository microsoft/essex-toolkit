# Copyright (c) 2025 Microsoft Corporation.

"""Tests for limiting.concurrency."""

from asyncio import Semaphore
from unittest.mock import Mock

from fnllm.limiting.concurrency import ConcurrencyLimiter
from fnllm.limiting.types import Manifest


async def test_concurrency_only_acquired_released_with_request_tokens():
    semaphore = Mock(spec=Semaphore)
    concurrency_limiter = ConcurrencyLimiter(semaphore)

    async with concurrency_limiter.use(Manifest(request_tokens=10)):
        semaphore.acquire.assert_called_once_with()

    semaphore.release.assert_called_once_with()


async def test_concurrency_not_acquired_released_without_request_tokens():
    semaphore = Mock(spec=Semaphore)
    concurrency_limiter = ConcurrencyLimiter(semaphore)

    async with concurrency_limiter.use(
        Manifest(request_tokens=0, post_request_tokens=10)
    ):
        semaphore.acquire.assert_not_called()

    semaphore.release.assert_not_called()
