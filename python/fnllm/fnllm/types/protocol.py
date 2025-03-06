# Copyright (c) 2024 Microsoft Corporation.

"""LLM protocol module."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, Generic, Protocol, runtime_checkable

from typing_extensions import Unpack

from .generics import THistoryEntry, TInput, TJsonModel, TModelParameters, TOutput

if TYPE_CHECKING:
    from .io import LLMInput, LLMOutput


@runtime_checkable
class LLM(
    Protocol, Generic[TInput, TOutput, THistoryEntry, TModelParameters]
):  # pragma: no cover
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

    def is_reasoning_model(self) -> bool:
        """Return whether the LLM uses a reasoning model."""
        ...
