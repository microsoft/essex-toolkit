# Copyright 2024 Microsoft Corporation.

"""Tests for llm.events.composite."""

from unittest.mock import Mock

from fnllm.events.base import LLMEvents
from fnllm.events.composite import LLMCompositeEvents


async def test_composite_events():
    delegate_a = Mock(spec=LLMEvents)
    delegate_b = Mock(spec=LLMEvents)
    events = LLMCompositeEvents([delegate_a, delegate_b])

    await events.on_execute_llm()
    delegate_a.on_execute_llm.assert_called_once()
    delegate_b.on_execute_llm.assert_called_once()

    await events.on_success(Mock())
    delegate_a.on_success.assert_called_once()
    delegate_b.on_success.assert_called_once()

    await events.on_error(Mock(), Mock(), Mock())
    delegate_a.on_error.assert_called_once()
    delegate_b.on_error.assert_called_once()

    await events.on_post_limit(Mock())
    delegate_a.on_post_limit.assert_called_once()
    delegate_b.on_post_limit.assert_called_once()

    await events.on_limit_acquired(Mock())
    delegate_a.on_limit_acquired.assert_called_once()
    delegate_b.on_limit_acquired.assert_called_once()

    await events.on_limit_released(Mock())
    delegate_a.on_limit_released.assert_called_once()
    delegate_b.on_limit_released.assert_called_once()

    await events.on_cache_hit("derp", "name")
    delegate_a.on_cache_hit.assert_called_once()
    delegate_b.on_cache_hit.assert_called_once()

    await events.on_cache_miss("derp", "name")
    delegate_a.on_cache_miss.assert_called_once()
    delegate_b.on_cache_miss.assert_called_once()

    await events.on_usage(Mock())
    delegate_a.on_usage.assert_called_once()
    delegate_b.on_usage.assert_called_once()

    await events.on_try(Mock())
    delegate_a.on_try.assert_called_once()
    delegate_b.on_try.assert_called_once()

    await events.on_retryable_error(Mock(), Mock())
    delegate_a.on_retryable_error.assert_called_once()
    delegate_b.on_retryable_error.assert_called_once()
