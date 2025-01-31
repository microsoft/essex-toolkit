# Copyright (c) 2024 Microsoft Corporation.


"""LLM Configuration Protocol definition."""

from __future__ import annotations

from enum import Enum


class RetryStrategy(str, Enum):
    """The retry strategy to use for the LLM service."""

    TENACITY = "tenacity"
    """Use the Tenacity library for retries."""

    NATIVE = "native"
    """Use the underlying model provider's default retry mechanism."""
