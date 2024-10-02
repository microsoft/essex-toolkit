# Copyright 2024 Microsoft Corporation.

"""Tests for caching.base."""

import json
from typing import Any

import pytest
from fnllm.caching.base import Cache, _hash


class MockCache(Cache):
    async def has(self, key: str) -> bool: ...

    async def get(self, key: str) -> Any | None: ...

    async def remove(self, key: str) -> None: ...

    async def clear(self) -> None: ...

    async def set(
        self, key: str, value: Any, metadata: dict[str, Any] | None = None
    ) -> None: ...

    def child(self, key: str) -> "Cache": ...


@pytest.fixture
def cache() -> Cache:
    return MockCache()


@pytest.mark.parametrize(argnames=("data"), argvalues=[("some_key", "some other key")])
def test_create_key(cache: Cache, data: str):
    key = cache.create_key(data)
    data_hash = _hash(json.dumps(data, sort_keys=True))

    assert key == f"{data_hash}_v{cache.__cache_strategy_version__}"


@pytest.mark.parametrize(
    argnames=("data", "prefix"),
    argvalues=[("some_key", "prefix_1"), ("some other key", "some other prefix")],
)
def test_create_key_with_prefix(cache: Cache, data: str, prefix: str):
    key = cache.create_key(data, prefix=prefix)
    data_hash = _hash(json.dumps(data, sort_keys=True))

    assert key == f"{prefix}_{data_hash}_v{cache.__cache_strategy_version__}"
