# Copyright (c) 2024 Microsoft Corporation.

"""Base LLM related errors."""

from __future__ import annotations


class InvalidLLMResultError(RuntimeError):
    """Invalid LLM result error."""

    def __init__(self, message: str) -> None:
        """Init method definition."""
        super().__init__(message)


class RetriesExhaustedError(RuntimeError):
    """Retries exhausted error."""

    def __init__(self, name: str, num_retries: int) -> None:
        """Init method definition."""
        super().__init__(
            f"Operation '{name}' failed - {num_retries} retries exhausted."
        )


class FailedToGenerateValidJsonError(RuntimeError):
    """Failed to create valid JSON error."""
