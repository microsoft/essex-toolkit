# Copyright (c) 2025 Microsoft Corporation.

"""Tests for limiting.rpm."""

from unittest.mock import Mock

from aiolimiter import AsyncLimiter
from fnllm.limiting.rpm import RPMLimiter
from fnllm.limiting.types import Manifest


async def test_rpm_only_acquired_with_request_tokens():
    async_limiter = Mock(spec=AsyncLimiter)
    rpm_limiter = RPMLimiter(async_limiter, rps=False)

    async with rpm_limiter.use(Manifest(request_tokens=10)):
        async_limiter.acquire.assert_called_once_with()


async def test_rpm_not_acquired_without_request_tokens():
    async_limiter = Mock(spec=AsyncLimiter)
    rpm_limiter = RPMLimiter(async_limiter, rps=False)

    async with rpm_limiter.use(Manifest(request_tokens=0, post_request_tokens=10)):
        async_limiter.acquire.assert_not_called()
