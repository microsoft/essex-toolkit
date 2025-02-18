# Copyright (c) 2024 Microsoft Corporation.

"""Cached LLM Implementation."""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Awaitable, Callable
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
    from fnllm.caching import Cache
    from fnllm.events import LLMEvents
    from fnllm.types.io import LLMInput

RetryableErrorHandler = Callable[[BaseException], Awaitable[None]]


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

            # If we're bypassing, invoke the delegate directly
            if bypass_cache:
                return await delegate(prompt, **kwargs)

            # If we're busting the cache, skip the cache read
            if not bust_cache:
                cached = await self._cache.get(key)
                if cached is not None:
                    await self._events.on_cache_hit(key, name)
                    output = self._cache_adapter.wrap_output(prompt, kwargs, cached)
                    return LLMOutput(output=output, cache_hit=True)

                await self._events.on_cache_miss(key, name)

            result = await delegate(prompt, **kwargs)
            input_data = self._cache_adapter.get_cache_input_data(prompt, kwargs)
            await self._cache.set(
                key,
                self._cache_adapter.dump_raw_model(result.output),
                {"input": input_data},
            )
            return result

        return cast(Any, invoke)
