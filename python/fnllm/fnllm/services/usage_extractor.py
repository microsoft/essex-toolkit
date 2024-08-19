# Copyright (c) 2024 Microsoft Corporation.

"""LLM cache-interactor module."""

from abc import ABC, abstractmethod
from typing import Generic

from fnllm.types import LLMUsageMetrics
from fnllm.types.generics import TOutput


class UsageExtractor(ABC, Generic[TOutput]):
    """Usage extractor base class."""

    @abstractmethod
    def extract_usage(
        self,
        output: TOutput,
    ) -> LLMUsageMetrics:
        """Extract LLM usage from the output."""
