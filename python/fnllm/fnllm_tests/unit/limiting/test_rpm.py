# Copyright 2024 Microsoft Corporation.

"""Tests for limiting.rpm."""

from unittest.mock import Mock

from aiolimiter import AsyncLimiter
from fnllm.limiting.base import Manifest
from fnllm.limiting.rpm import RPMLimiter


async def test_rpm_only_acquired_with_request_tokens():
    async_limiter = Mock(spec=AsyncLimiter)
    rpm_limiter = RPMLimiter(async_limiter)

    async with rpm_limiter.use(Manifest(request_tokens=10)):
        async_limiter.acquire.assert_called_once_with()


async def test_rpm_not_acquired_without_request_tokens():
    async_limiter = Mock(spec=AsyncLimiter)
    rpm_limiter = RPMLimiter(async_limiter)

    async with rpm_limiter.use(Manifest(request_tokens=0, post_request_tokens=10)):
        async_limiter.acquire.assert_not_called()
