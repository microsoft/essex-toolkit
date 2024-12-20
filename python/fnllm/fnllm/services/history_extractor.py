# Copyright (c) 2024 Microsoft Corporation.

"""LLM cache-interactor module."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, Generic

from fnllm.types.generics import THistoryEntry, TOutput

if TYPE_CHECKING:
    from collections.abc import Sequence


class HistoryExtractor(ABC, Generic[TOutput, THistoryEntry]):
    """History extractor base class."""

    @abstractmethod
    def extract_history(
        self,
        history: Sequence[THistoryEntry] | None,
        output: TOutput,
    ) -> list[THistoryEntry]:
        """Extract history from a response."""
