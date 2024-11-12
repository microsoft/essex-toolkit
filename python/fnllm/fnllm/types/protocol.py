# Copyright (c) 2024 Microsoft Corporation.

"""LLM protocol module."""

from typing import Any, Generic, Protocol, runtime_checkable

from typing_extensions import Unpack

from .generics import THistoryEntry, TInput, TJsonModel, TModelParameters, TOutput
from .io import LLMInput, LLMOutput


@runtime_checkable
class LLM(Protocol, Generic[TInput, TOutput, THistoryEntry, TModelParameters]):
    """LLM protocol definition."""

    async def __call__(
        self,
        prompt: TInput,
        **kwargs: Unpack[LLMInput[TJsonModel, THistoryEntry, TModelParameters]],
    ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:  # pragma: no cover
        """Invoke the LLM, treating the LLM as a function."""
        ...

    def child(self, name: str) -> Any:
        """Create a child LLM (with child cache)."""
        ...
