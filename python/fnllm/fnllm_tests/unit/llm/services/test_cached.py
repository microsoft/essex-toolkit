# Copyright 2024 Microsoft Corporation.

"""Tests for the Cached Decorator."""

from unittest.mock import AsyncMock, Mock

from fnllm.base.services.cached import Cached
from fnllm.types.io import LLMOutput


def test_cached() -> None:
    """Test the Cached Decorator."""
    decorator = Cached(cache=Mock(), events=Mock(), cache_adapter=Mock())
    assert decorator is not None


def test_cached_child() -> None:
    """Test the Cached Decorator child."""
    decorator = Cached(cache=Mock(), events=Mock(), cache_adapter=Mock())
    child = decorator.child("test")
    assert child is not None
    assert child != decorator


async def test_cache_miss() -> None:
    """Test the Cached Decorator normal call."""
    delegate = AsyncMock()

    # Empty cache
    cache = Mock()
    cache.get = AsyncMock(return_value=None)
    cache.set = AsyncMock(return_value=None)

    # Mock Events
    events = Mock()
    events.on_cache_miss = AsyncMock(return_value=None)

    decorator = Cached(cache=cache, events=events, cache_adapter=Mock())
    decorated = decorator.decorate(delegate)

    result = await decorated("test", name="test")
    assert result is not None


async def test_cache_hit() -> None:
    """Test the Cached Decorator normal call."""
    delegate = AsyncMock()

    # Empty cache
    cache = Mock()
    cache.get = AsyncMock(return_value="abcdef")
    cache.set = AsyncMock(return_value=None)

    # Mock Events
    events = Mock()
    events.on_cache_hit = AsyncMock(return_value=None)

    # Mock Adapter
    adapter = Mock()
    adapter.wrap_output = lambda _, __, x: x

    decorator = Cached(cache=cache, events=events, cache_adapter=adapter)
    decorated = decorator.decorate(delegate)

    result = await decorated("test", name="test")
    assert result.output == "abcdef"


async def test_cache_bypass() -> None:
    """Test the Cached Decorator normal call."""
    delegate = AsyncMock()

    # Empty cache
    cache = Mock()
    cache.set = AsyncMock(return_value=None)

    # Mock Events
    events = Mock()

    decorator = Cached(cache=cache, events=events, cache_adapter=Mock())
    decorated = decorator.decorate(delegate)

    result = await decorated("test", name="test", bypass_cache=True)
    assert result is not None


async def test_cache_bust() -> None:
    """Test the Cached Decorator normal call."""
    delegate = AsyncMock(return_value=LLMOutput(output="abcdef"))

    # Empty cache
    cache = Mock()
    cache.set = AsyncMock(return_value=None)

    # Mock Events
    events = Mock()

    # Mock Adapter
    adapter = Mock()
    adapter.wrap_output = lambda _, __, x: x

    decorator = Cached(cache=cache, events=events, cache_adapter=adapter)
    decorated = decorator.decorate(delegate)

    result = await decorated("test", name="test", bust_cache=True)
    assert result.output == "abcdef"
