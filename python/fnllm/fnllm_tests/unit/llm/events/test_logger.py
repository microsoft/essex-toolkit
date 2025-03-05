# Copyright 2024 Microsoft Corporation.

"""Tests for llm.events.logger."""

from logging import DEBUG, ERROR, WARNING

import pytest
from fnllm.events.logger import LLMEventsLogger
from fnllm.limiting.base import Manifest
from fnllm.types.metrics import LLMMetrics, LLMUsageMetrics


def check_records_and_reset(
    caplog: pytest.LogCaptureFixture, level: int, prefix: str
) -> None:
    assert isinstance(caplog.record_tuples, list)
    assert len(caplog.records) == 1
    assert caplog.record_tuples[0][1] == level, (
        f"expected {level} but got {caplog.record_tuples[0][1]}"
    )
    assert caplog.record_tuples[0][0] == "fnllm.events.logger", "unexpected logger name"
    assert caplog.record_tuples[0][2].startswith(prefix), (
        f"unexpected message: {caplog.record_tuples[0][2]}"
    )
    caplog.clear()


async def test_logger_is_called(caplog: pytest.LogCaptureFixture):
    events = LLMEventsLogger()
    caplog.set_level(DEBUG)

    await events.on_error(None, None, {})
    check_records_and_reset(caplog, ERROR, "unexpected error occurred for arguments")

    await events.on_usage(LLMUsageMetrics())
    check_records_and_reset(caplog, DEBUG, "LLM usage")

    await events.on_limit_acquired(Manifest())
    check_records_and_reset(caplog, DEBUG, "limit acquired for request")

    await events.on_limit_released(Manifest())
    check_records_and_reset(caplog, DEBUG, "limit released for request")

    await events.on_post_limit(Manifest())
    check_records_and_reset(caplog, DEBUG, "post request limiting triggered")

    await events.on_success(LLMMetrics())
    check_records_and_reset(caplog, DEBUG, "request succeed with")

    await events.on_cache_hit("", "")
    check_records_and_reset(caplog, DEBUG, "cache hit for key")

    await events.on_cache_miss("", "")
    check_records_and_reset(caplog, DEBUG, "cache miss for key")

    await events.on_try(1)
    check_records_and_reset(caplog, DEBUG, "calling llm, attempt")

    await events.on_retryable_error(BaseException(), 1)
    check_records_and_reset(caplog, WARNING, "retryable error happened on attempt")
