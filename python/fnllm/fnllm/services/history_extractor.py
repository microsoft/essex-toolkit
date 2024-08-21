# Copyright (c) 2024 Microsoft Corporation.

"""LLM cache-interactor module."""

from abc import ABC, abstractmethod
from collections.abc import Sequence
from typing import Generic

from fnllm.types.generics import THistoryEntry, TOutput


class HistoryExtractor(ABC, Generic[TOutput, THistoryEntry]):
    """History extractor base class."""

    @abstractmethod
    def extract_history(
        self,
        history: Sequence[THistoryEntry] | None,
        output: TOutput,
    ) -> list[THistoryEntry]:
        """Extract history from a response."""
