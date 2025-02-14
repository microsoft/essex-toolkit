# Copyright (c) 2024 Microsoft Corporation.

"""Cached LLM Implementation."""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Awaitable, Callable
from typing import TYPE_CHECKING, Any, Generic

from typing_extensions import Unpack

from fnllm.types.generics import (
    THistoryEntry,
    TInput,
    TJsonModel,
    TModelParameters,
    TOutput,
)

from .decorator import LLMDecorator

if TYPE_CHECKING:
    from fnllm.caching import Cache
    from fnllm.events import LLMEvents
    from fnllm.types.io import LLMInput, LLMOutput

RetryableErrorHandler = Callable[[BaseException], Awaitable[None]]


class CacheKeyBuilder(ABC):
    """A cache key builder."""

    @abstractmethod
    def build_cache_key(self, prompt: TInput, kwargs: LLMInput[Any, Any, Any]) -> str:
        """Build a cache key from the prompt and kwargs."""

    @abstractmethod
    def get_cache_input_data(
        self, prompt: TInput, kwargs: LLMInput[Any, Any, Any]
    ) -> dict[str, Any]:
        """Get the cache metadata from the prompt and kwargs."""


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
        cache_key_builder: CacheKeyBuilder,
    ):
        """Create a new CachingLLM."""
        self._events = events
        self._cache = cache
        self._cache_key_builder = cache_key_builder

    def child(
        self, name: str
    ) -> Cached[TInput, TOutput, THistoryEntry, TModelParameters]:
        """Create a child Cached instance."""
        return Cached(
            cache=self._cache.child(name),
            events=self._events,
            cache_key_builder=self._cache_key_builder,
        )

    def decorate(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
    ) -> Callable[..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]]:
        """Execute the LLM with a cache."""

        async def invoke(prompt: TInput, **kwargs: Unpack[LLMInput[Any, Any, Any]]):
            key = self._cache_key_builder.build_cache_key(prompt, kwargs)
            cached = await self._cache.get(key)
            if cached is not None:
                return cached

            result = await delegate(prompt, **kwargs)
            input_data = self._cache_key_builder.get_cache_input_data(prompt, kwargs)
            await self._cache.set(
                key,
                result.model_dump(),
                {"input": input_data},
            )
            return result

        return invoke
