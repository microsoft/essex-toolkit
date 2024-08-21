# Copyright 2024 Microsoft Corporation.

"""Tests for llm.events.logger."""

from logging import Logger
from unittest.mock import Mock

from fnllm.events.logger import LLMEventsLogger
from fnllm.limiting.base import Manifest
from fnllm.types.metrics import LLMMetrics, LLMUsageMetrics


async def test_logger_is_called():
    logger = Mock(spec=Logger)
    events = LLMEventsLogger(logger)

    # asserting all events call logger
    logger.reset_mock()
    await events.on_error(None, None, {})
    logger.error.assert_called_once()

    logger.reset_mock()
    await events.on_usage(LLMUsageMetrics())
    logger.info.assert_called_once()

    logger.reset_mock()
    await events.on_limit_acquired(Manifest())
    logger.info.assert_called_once()

    logger.reset_mock()
    await events.on_limit_released(Manifest())
    logger.info.assert_called_once()

    logger.reset_mock()
    await events.on_post_limit(Manifest())
    logger.info.assert_called_once()

    logger.reset_mock()
    await events.on_success(LLMMetrics())
    logger.info.assert_called_once()

    logger.reset_mock()
    await events.on_cache_hit("", "")
    logger.info.assert_called_once()

    logger.reset_mock()
    await events.on_cache_miss("", "")
    logger.info.assert_called_once()

    logger.reset_mock()
    await events.on_try(1)
    logger.debug.assert_called_once()

    logger.reset_mock()
    await events.on_retryable_error(Mock(), 1)
    logger.warning.assert_called_once()
