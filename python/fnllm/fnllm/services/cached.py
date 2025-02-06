# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, Any, Generic

from typing_extensions import Unpack

from fnllm.caching import Cache
from fnllm.events.base import LLMEvents
from fnllm.types.generics import (
    THistoryEntry,
    TInput,
    TJsonModel,
    TModelParameters,
    TOutput,
)

from .decorator import LLMDecorator

if TYPE_CHECKING:
    from collections.abc import Awaitable, Callable

    from fnllm.types.io import LLMInput, LLMOutput


class Cached(
    ABC,
    LLMDecorator[TOutput, THistoryEntry],
    Generic[TInput, TOutput, THistoryEntry, TModelParameters],
):
    """A base class to add retries to an llm."""

    def __init__(self, *, cache: Cache, events: LLMEvents | None = None):
        """Create a new RetryingLLM."""
        self._cache = Cache
        self._events = events or LLMEvents()

    def decorate(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
    ) -> Callable[..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]]:
        """Execute the LLM with the configured rate limits."""

        async def invoke(prompt: TInput, **kwargs: Unpack[LLMInput[Any, Any, Any]]):
            cache_key = self._create_cache_key(prompt, **kwargs)
            cached_result = await self._cache.get(cache_key)
            if cached_result is not None:
                await self.on_cache_hit(cache_key)
                return self._package_cache_response(cached_result)

            await self._events.on_cache_miss(cache_key)
            result = await delegate(prompt, **kwargs)
            await self._cache.set(cache_key, self._serialize_cache_value(result.output))
            return result

        return invoke

    @abstractmethod
    def _create_cache_key(
        self, prompt: TInput, **kwargs: Unpack[LLMInput[Any, Any, Any]]
    ) -> str:
        """Create a cache key for the given prompt and kwargs."""

    @abstractmethod
    def _package_cache_response(
        self, output: TOutput
    ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
        """Pack the output into a cacheable response."""

    @abstractmethod
    def _serialize_cache_value(self, output: TOutput) -> dict[str, Any]:
        """Extract the cached value from the output."""
