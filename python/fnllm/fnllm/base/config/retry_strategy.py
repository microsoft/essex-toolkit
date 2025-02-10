# Copyright (c) 2024 Microsoft Corporation.


"""LLM Configuration Protocol definition."""

from __future__ import annotations

from enum import Enum


class RetryStrategy(str, Enum):
    """The retry strategy to use for the LLM service."""

    TENACITY = "tenacity"
    """Use the Tenacity library for retries with exponential backoff."""

    TENACITY_RANDOM = "tenacity_random"
    """Use the Tenacity library for retries with random wait times."""

    TENACITY_INCREMENTAL = "tenacity_incremental"
    """Use the Tenacity library for retries with incremental wait times."""

    NATIVE = "native"
    """Use the underlying model provider's default retry mechanism."""
