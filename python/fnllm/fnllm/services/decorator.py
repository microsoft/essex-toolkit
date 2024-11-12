# Copyright (c) 2024 Microsoft Corporation.

"""Base protocol for decorator services."""

from collections.abc import Awaitable, Callable
from typing import Generic, Protocol, runtime_checkable

from fnllm.types.generics import THistoryEntry, TJsonModel, TOutput
from fnllm.types.io import LLMOutput


@runtime_checkable
class LLMDecorator(Protocol, Generic[TOutput, THistoryEntry]):
    """A decorator for LLM calls."""

    def decorate(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
    ) -> Callable[..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]]:
        """Decorate the delegate with the LLM functionality."""
        ...
