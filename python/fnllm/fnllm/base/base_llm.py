# Copyright (c) 2024 Microsoft Corporation.

"""Base LLM module."""

from __future__ import annotations

import traceback
from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, Generic

from typing_extensions import Unpack

from fnllm.events.base import LLMEvents
from fnllm.types.generics import (
    THistoryEntry,
    TInput,
    TJsonModel,
    TModelParameters,
    TOutput,
)
from fnllm.types.io import LLMInput, LLMOutput
from fnllm.types.metrics import LLMUsageMetrics
from fnllm.types.protocol import LLM

if TYPE_CHECKING:
    from collections.abc import Sequence

    from .services.cached import Cached
    from .services.decorator import LLMDecorator
    from .services.history_extractor import HistoryExtractor
    from .services.json import JsonReceiver
    from .services.rate_limiter import RateLimiter
    from .services.retryer import Retryer
    from .services.usage_extractor import UsageExtractor
    from .services.variable_injector import VariableInjector


class BaseLLM(
    ABC,
    LLM[TInput, TOutput, THistoryEntry, TModelParameters],
    Generic[TInput, TOutput, THistoryEntry, TModelParameters],
):
    """Base LLM interface definition."""

    def __init__(
        self,
        *,
        events: LLMEvents | None = None,
        cached: Cached[TInput, TOutput, THistoryEntry, TModelParameters] | None = None,
        usage_extractor: UsageExtractor[TOutput] | None = None,
        history_extractor: HistoryExtractor[TOutput, THistoryEntry] | None = None,
        variable_injector: VariableInjector | None = None,
        rate_limiter: RateLimiter[TInput, TOutput, THistoryEntry, TModelParameters]
        | None = None,
        retryer: Retryer[TInput, TOutput, THistoryEntry, TModelParameters]
        | None = None,
        json_receiver: JsonReceiver[TInput, TOutput, THistoryEntry, TModelParameters]
        | None = None,
    ) -> None:
        """Base constructor for the BaseLLM."""
        self._events = events or LLMEvents()
        self._usage_extractor = usage_extractor
        self._history_extractor = history_extractor
        self._variable_injector = variable_injector
        self._rate_limiter = rate_limiter
        self._retryer = retryer
        self._json_receiver = json_receiver
        self._cached = cached

        decorated = self._decorator_target
        for decorator in self.decorators:
            decorated = decorator.decorate(decorated)
        self._decorated_target = decorated

    def child(
        self, name: str
    ) -> BaseLLM[TInput, TOutput, THistoryEntry, TModelParameters]:
        """Create a child LLM."""
        if self._cached is None:
            return self
        return self.__class__(
            events=self._events,
            cached=self._cached.child(name),
            usage_extractor=self._usage_extractor,
            history_extractor=self._history_extractor,
            variable_injector=self._variable_injector,
            rate_limiter=self._rate_limiter,
            retryer=self._retryer,
            json_receiver=self._json_receiver,
        )

    @abstractmethod
    def is_reasoning_model(self) -> bool:
        """Return whether the LLM uses a reasoning model."""
        ...

    @property
    def events(self) -> LLMEvents:
        """Registered LLM events handler."""
        return self._events

    @property
    def decorators(self) -> list[LLMDecorator[TOutput, THistoryEntry]]:
        """Get the list of LLM decorators."""
        decorators: list[LLMDecorator] = []
        if self._rate_limiter:
            decorators.append(self._rate_limiter)
        if self._retryer:
            decorators.append(self._retryer)
        if self._cached:
            decorators.append(self._cached)
        if self._json_receiver:
            decorators.append(self._json_receiver)
        return decorators

    async def _decorator_target(
        self,
        prompt: TInput,
        **kwargs: Unpack[LLMInput[TJsonModel, THistoryEntry, TModelParameters]],
    ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
        """Target for the decorator chain.

        Leave signature alone as prompt,  kwargs.
        """
        await self._events.on_execute_llm()
        output = await self._execute_llm(prompt, kwargs)
        result = LLMOutput(output=output)
        await self._inject_usage(result)
        self._inject_history(result, kwargs.get("history"))
        return result

    async def __call__(
        self,
        prompt: TInput,
        **kwargs: Unpack[LLMInput[TJsonModel, THistoryEntry, TModelParameters]],
    ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
        """
        Invoke the LLM.

        This is the primary entry point for invoking the LLM.
        """
        try:
            prompt, kwargs = self._rewrite_input(prompt, kwargs)
            return await self._decorated_target(prompt, **kwargs)
        except BaseException as e:
            stack_trace = traceback.format_exc()
            if self._events:
                await self._events.on_error(
                    e, stack_trace, {"prompt": prompt, "kwargs": kwargs}
                )
            raise

    def _rewrite_input(
        self,
        prompt: TInput,
        kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters],
    ) -> tuple[TInput, LLMInput[TJsonModel, THistoryEntry, TModelParameters]]:
        """Rewrite the input prompt and arguments.."""
        if self._variable_injector:
            prompt = self._variable_injector.inject_variables(
                prompt, kwargs.get("variables")
            )
        return prompt, kwargs

    async def _inject_usage(
        self,
        result: LLMOutput[TOutput, TJsonModel, THistoryEntry],
    ):
        usage = LLMUsageMetrics()
        if self._usage_extractor and not result.cache_hit:
            usage = self._usage_extractor.extract_usage(result.output)
            await self._events.on_usage(usage)
        result.metrics.usage = usage

    def _inject_history(
        self,
        result: LLMOutput[TOutput, TJsonModel, THistoryEntry],
        history: Sequence[THistoryEntry] | None,
    ) -> None:
        if self._history_extractor:
            result.history = self._history_extractor.extract_history(
                history, result.output
            )

    @abstractmethod
    async def _execute_llm(
        self,
        prompt: TInput,
        kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters],
    ) -> TOutput: ...

    def is_json_mode(
        self, kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters]
    ) -> bool:
        """Check if the given request is requesting JSON mode."""
        return kwargs.get("json") is True or kwargs.get("json_model") is not None
