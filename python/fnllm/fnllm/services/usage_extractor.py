# Copyright (c) 2024 Microsoft Corporation.

"""LLM cache-interactor module."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, Generic

from fnllm.types.generics import TOutput

if TYPE_CHECKING:
    from fnllm.types import LLMUsageMetrics


class UsageExtractor(ABC, Generic[TOutput]):
    """Usage extractor base class."""

    @abstractmethod
    def extract_usage(
        self,
        output: TOutput,
    ) -> LLMUsageMetrics:
        """Extract LLM usage from the output."""
