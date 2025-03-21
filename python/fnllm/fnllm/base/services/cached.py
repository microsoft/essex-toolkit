# Copyright (c) 2024 Microsoft Corporation.

"""Cached LLM Implementation."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, Any, Generic, cast

from typing_extensions import Unpack

from fnllm.types.generics import (
    THistoryEntry,
    TInput,
    TJsonModel,
    TModelParameters,
    TOutput,
)
from fnllm.types.io import LLMOutput

from .decorator import LLMDecorator

if TYPE_CHECKING:
    from collections.abc import Awaitable, Callable

    from fnllm.caching import Cache
    from fnllm.events import LLMEvents
    from fnllm.types.io import LLMInput


class CacheAdapter(ABC, Generic[TInput, TOutput]):
    """A cache key builder."""

    @abstractmethod
    def build_cache_key(self, prompt: TInput, kwargs: LLMInput[Any, Any, Any]) -> str:
        """Build a cache key from the prompt and kwargs."""

    @abstractmethod
    def get_cache_input_data(
        self, prompt: TInput, kwargs: LLMInput[Any, Any, Any]
    ) -> dict[str, Any]:
        """Get the cache metadata from the prompt and kwargs."""

    @abstractmethod
    def wrap_output(
        self,
        prompt: TInput,
        kwargs: LLMInput[Any, Any, Any],
        cached_result: dict[str, Any],
    ) -> TOutput:
        """Get the model to validate the cached result."""

    @abstractmethod
    def dump_raw_model(self, output: TOutput) -> dict[str, Any]:
        """Get the model to validate the cached result."""


class Cached(
    LLMDecorator[TOutput, THistoryEntry],
    Generic[TInput, TOutput, THistoryEntry, TModelParameters],
):
    """A base class for a cache-interacting LLM."""

    def __init__(
        self,
        *,
        cache: Cache,
        events: LLMEvents,
        cache_adapter: CacheAdapter[TInput, TOutput],
    ):
        """Create a new CachingLLM."""
        self._events = events
        self._cache = cache
        self._cache_adapter = cache_adapter

    def child(
        self, name: str
    ) -> Cached[TInput, TOutput, THistoryEntry, TModelParameters]:
        """Create a child Cached instance."""
        return Cached(
            cache=self._cache.child(name),
            events=self._events,
            cache_adapter=self._cache_adapter,
        )

    def _dump_output(self, output: TOutput) -> dict[str, Any]:
        """Dump the raw model output."""
        return self._cache_adapter.dump_raw_model(output)

    def decorate(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
    ) -> Callable[..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]]:
        """Execute the LLM with a cache."""

        async def invoke(prompt: TInput, **kwargs: Unpack[LLMInput[Any, Any, Any]]):
            key = self._cache_adapter.build_cache_key(prompt, kwargs)
            name = kwargs.get("name")
            bypass_cache = kwargs.get("bypass_cache", False)
            bust_cache = kwargs.get("bust_cache", False)
            cache_metadata = kwargs.get("cache_metadata")

            #
            # If we're bypassing, invoke the delegate directly
            #
            if bypass_cache:
                return await delegate(prompt, **kwargs)

            metadata = self._get_metadata(
                key=key,
                data=self._cache_adapter.get_cache_input_data(prompt, kwargs),
                metadata=cache_metadata,
            )

            #
            # If we're busting the cache, invoke the LLM, write the result,  and don't bother checking for collisions
            #
            if bust_cache:
                result = await delegate(prompt, **kwargs)
                await self._cache.set(key, self._dump_output(result.output), metadata)
                return result

            #
            # Check the cache before invoking the LLM
            #
            cached = await self._cache.get(key)
            if cached is not None:
                await self._events.on_cache_hit(key, name)
                output = self._cache_adapter.wrap_output(prompt, kwargs, cached)
                return LLMOutput(output=output, cache_hit=True)

            #
            # If we don't have a cache hit, invoke the LLM
            #
            result = await delegate(prompt, **kwargs)

            #
            # Check for inflight collisions
            #
            cached = await self._cache.get(key)
            if cached is not None:
                await self._events.on_cache_hit(key, name)
                output = self._cache_adapter.wrap_output(prompt, kwargs, cached)
                return LLMOutput(output=output, cache_hit=True)

            #
            # Write out to the cache
            #
            await self._events.on_cache_miss(key, name)
            await self._cache.set(key, self._dump_output(result.output), metadata)

            return result

        return cast(Any, invoke)

    def _get_metadata(
        self,
        *,
        key: str,
        data: dict[str, Any],
        metadata: dict[str, Any] | None,
    ) -> dict[str, Any]:
        """Get the metadata for the cache."""
        result = {"input": data, "key": key}
        if metadata:
            result["custom"] = metadata
        return result
