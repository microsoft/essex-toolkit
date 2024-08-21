# Copyright 2024 Microsoft Corporation.

"""Tests for llm.events.usage_tracker."""

from unittest.mock import AsyncMock

from fnllm.events.usage_tracker import LLMUsageTracker
from fnllm.limiting.base import Manifest
from fnllm.types.metrics import LLMUsageMetrics
from fnllm.utils.sliding_window import SlidingWindow


async def test_usage_tracker():
    rpm_sliding_window = _mock_sliding_window(return_sum=10, return_avg=100)
    tpm_sliding_window = _mock_sliding_window(return_sum=50, return_avg=500)
    tracker = LLMUsageTracker(rpm_sliding_window, tpm_sliding_window)
    metrics = LLMUsageMetrics(input_tokens=10, output_tokens=20)
    input_manifest = Manifest(request_tokens=metrics.input_tokens - 5)
    output_manifest = Manifest(
        post_request_tokens=metrics.total_tokens - input_manifest.request_tokens
    )

    # assert proper calls on insertion
    await tracker.on_limit_acquired(input_manifest)

    rpm_sliding_window.insert.assert_called_once_with(1)
    tpm_sliding_window.insert.assert_called_once_with(input_manifest.request_tokens)

    # check post limit triggers tpm
    rpm_sliding_window.reset_mock()
    tpm_sliding_window.reset_mock()

    await tracker.on_post_limit(output_manifest)

    rpm_sliding_window.insert.assert_not_called()
    tpm_sliding_window.insert.assert_called_once_with(
        output_manifest.post_request_tokens
    )

    # assert proper calls for values
    assert await tracker.current_rpm() == 10
    assert await tracker.avg_rpm() == 100
    assert await tracker.current_tpm() == 50
    assert await tracker.avg_tpm() == 500

    # check total usage
    await tracker.on_usage(metrics)
    await tracker.on_usage(metrics)
    assert tracker.total_requests == 2
    assert tracker.total_usage == LLMUsageMetrics(
        input_tokens=metrics.input_tokens * 2, output_tokens=metrics.output_tokens * 2
    )

    # test concurrency
    assert tracker.current_concurrency == 1
    assert tracker.max_concurrency == 1

    await tracker.on_limit_acquired(output_manifest)
    assert tracker.current_concurrency == 2
    assert tracker.max_concurrency == 2

    await tracker.on_limit_acquired(output_manifest)
    assert tracker.current_concurrency == 3
    assert tracker.max_concurrency == 3

    await tracker.on_limit_released(output_manifest)
    assert tracker.current_concurrency == 2
    assert tracker.max_concurrency == 3

    await tracker.on_limit_released(output_manifest)
    assert tracker.current_concurrency == 1
    assert tracker.max_concurrency == 3

    await tracker.on_limit_released(output_manifest)
    assert tracker.current_concurrency == 0
    assert tracker.max_concurrency == 3


def test_create():
    assert LLMUsageTracker.create() is not None


def _mock_sliding_window(return_sum: float, return_avg: float):
    mock = AsyncMock(spec=SlidingWindow)

    mock.sum.return_value = return_sum
    mock.avg.return_value = return_avg

    return mock
