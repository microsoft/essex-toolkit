# Copyright (c) 2024 Microsoft Corporation.


"""LLM Configuration Protocol definition."""

from __future__ import annotations

from enum import Enum


class RetryStrategy(str, Enum):
    """The retry strategy to use for the LLM service."""

    EXPONENTIAL_BACKOFF = "exponential_backoff"
    """Use exponential backoff for retries (e.g. exponential factor + randomized max_wait)."""

    RANDOM_WAIT = "random_wait"
    """Use random wait times between [0, max_retry_wait] for retries."""

    INCREMENTAL_WAIT = "incremental_wait"
    """Use incremental wait times between [0, max_retry_wait] for retries."""

    NATIVE = "native"
    """Use the underlying model provider's default retry mechanism."""
