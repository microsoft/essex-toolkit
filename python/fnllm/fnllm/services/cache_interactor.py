# Copyright (c) 2024 Microsoft Corporation.

"""LLM cache-interactor module."""

from collections.abc import Awaitable, Callable
from typing import Any

from fnllm.caching.base import Cache
from fnllm.events.base import LLMEvents
from fnllm.types.generics import TJsonModel


class CacheInteractor:
    """A cache interactor class."""

    def __init__(
        self, events: LLMEvents | None = None, cache: Cache | None = None
    ) -> None:
        """Base constructor for the BaseLLM."""
        self._events = events or LLMEvents()
        self._cache = cache

    def child(self, name: str) -> "CacheInteractor":
        """Create a child cache interactor."""
        if self._cache is None:
            return self
        return CacheInteractor(events=self._events, cache=self._cache.child(name))

    async def get_or_insert(
        self,
        func: Callable[[], Awaitable[TJsonModel]],
        *,
        prefix: str,
        key_data: dict[str, Any],
        name: str | None,
        json_model: type[TJsonModel],
        bypass_cache: bool = False,
    ) -> TJsonModel:
        """Get or insert an item into the cache."""
        if not self._cache or bypass_cache:
            return await func()

        key = self._cache.create_key(key_data, prefix=prefix)
        cached_value = await self._cache.get(key)

        if cached_value:
            entry = json_model.model_validate(cached_value)
            await self._events.on_cache_hit(key, name)
        else:
            entry = await func()
            await self._cache.set(key, entry.model_dump(), {"input": key_data})
            await self._events.on_cache_miss(key, name)

        return entry
