# Copyright 2024 Microsoft Corporation.

"""Tests for limiting.tpm."""

from unittest.mock import Mock

from aiolimiter import AsyncLimiter
from fnllm.limiting.base import Manifest
from fnllm.limiting.tpm import TPMLimiter


async def test_tpm_acquired_with_sum_of_request_and_post_request_tokens():
    async_limiter = Mock(spec=AsyncLimiter)
    tpm_limiter = TPMLimiter(async_limiter, 100)

    async with tpm_limiter.use(Manifest(request_tokens=10, post_request_tokens=20)):
        async_limiter.acquire.assert_called_once_with(30)


async def test_tpm_only_acquired_with_non_zero_tokens_sum():
    async_limiter = Mock(spec=AsyncLimiter)
    tpm_limiter = TPMLimiter(async_limiter, 100)

    async with tpm_limiter.use(Manifest()):
        async_limiter.acquire.assert_not_called()
