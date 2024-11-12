# Copyright (c) 2024 Microsoft Corporation.

"""Base LLM module."""

import traceback
from abc import ABC, abstractmethod
from collections.abc import Sequence
from typing import Generic

from typing_extensions import Unpack

from fnllm.caching.base import Cache
from fnllm.events.base import LLMEvents
from fnllm.services.decorator import LLMDecorator
from fnllm.services.history_extractor import HistoryExtractor
from fnllm.services.json import JsonHandler
from fnllm.services.rate_limiter import RateLimiter
from fnllm.services.retryer import Retryer
from fnllm.services.usage_extractor import UsageExtractor
from fnllm.services.variable_injector import VariableInjector
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
        cache: Cache | None = None,
        usage_extractor: UsageExtractor[TOutput] | None = None,
        history_extractor: HistoryExtractor[TOutput, THistoryEntry] | None = None,
        variable_injector: VariableInjector | None = None,
        rate_limiter: RateLimiter[TInput, TOutput, THistoryEntry, TModelParameters]
        | None = None,
        retryer: Retryer[TInput, TOutput, THistoryEntry, TModelParameters]
        | None = None,
        json_handler: JsonHandler[TOutput, THistoryEntry] | None = None,
    ) -> None:
        """Base constructor for the BaseLLM."""
        self._events = events or LLMEvents()
        self._cache = cache
        self._usage_extractor = usage_extractor
        self._history_extractor = history_extractor
        self._variable_injector = variable_injector
        self._rate_limiter = rate_limiter
        self._retryer = retryer
        self._json_handler = json_handler

        decorated = self._decorator_target
        for decorator in self.decorators:
            decorated = decorator.decorate(decorated)
        self._decorated_target = decorated

    def child(
        self, name: str
    ) -> "BaseLLM[TInput, TOutput, THistoryEntry, TModelParameters]":
        """Create a child LLM."""
        if self._cache is None:
            return self
        return self.__class__(
            events=self._events,
            cache=self._cache.child(name),
            usage_extractor=self._usage_extractor,
            history_extractor=self._history_extractor,
            variable_injector=self._variable_injector,
            rate_limiter=self._rate_limiter,
            retryer=self._retryer,
            json_handler=self._json_handler,
        )

    @property
    def events(self) -> LLMEvents:
        """Registered LLM events handler."""
        return self._events

    @property
    def decorators(self) -> list[LLMDecorator[TOutput, THistoryEntry]]:
        """Get the list of LLM decorators."""
        decorators: list[LLMDecorator] = []
        if self._json_handler and self._json_handler.requester:
            decorators.append(self._json_handler.requester)
        if self._rate_limiter:
            decorators.append(self._rate_limiter)
        if self._retryer:
            decorators.append(self._retryer)
        if self._json_handler and self._json_handler.receiver:
            decorators.append(self._json_handler.receiver)
        return decorators

    async def __call__(
        self,
        prompt: TInput,
        **kwargs: Unpack[LLMInput[TJsonModel, THistoryEntry, TModelParameters]],
    ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
        """Invoke the LLM."""
        try:
            return await self._invoke(prompt, **kwargs)
        except BaseException as e:
            stack_trace = traceback.format_exc()
            if self._events:
                await self._events.on_error(
                    e, stack_trace, {"prompt": prompt, "kwargs": kwargs}
                )
            raise

    async def _invoke(
        self,
        prompt: TInput,
        **kwargs: Unpack[LLMInput[TJsonModel, THistoryEntry, TModelParameters]],
    ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
        """Run the LLM invocation, returning an LLMOutput."""
        prompt, kwargs = self._rewrite_input(prompt, kwargs)
        return await self._decorated_target(prompt, **kwargs)

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

    async def _decorator_target(
        self,
        prompt: TInput,
        **kwargs: Unpack[LLMInput[TJsonModel, THistoryEntry, TModelParameters]],
    ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
        """Target for the decorator chain.

        Leave signature alone as prompt, **kwargs.
        """
        await self._events.on_execute_llm()
        output = await self._execute_llm(prompt, **kwargs)
        result: LLMOutput[TOutput, TJsonModel, THistoryEntry] = LLMOutput(output=output)

        await self._inject_usage(result)
        self._inject_history(result, kwargs.get("history"))

        return result

    async def _inject_usage(
        self, result: LLMOutput[TOutput, TJsonModel, THistoryEntry]
    ):
        usage = LLMUsageMetrics()
        if self._usage_extractor:
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
        **kwargs: Unpack[LLMInput[TJsonModel, THistoryEntry, TModelParameters]],
    ) -> TOutput: ...
