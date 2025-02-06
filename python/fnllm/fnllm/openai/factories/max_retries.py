# Copyright (c) 2024 Microsoft Corporation.

"""Get max retries for OpenAI client."""

from __future__ import annotations

from typing import TYPE_CHECKING

from fnllm.base.config import RetryStrategy

if TYPE_CHECKING:
    from fnllm.openai.config import OpenAIConfig


def get_max_retries(config: OpenAIConfig) -> int:
    """Get max retries for OpenAI client."""
    return config.max_retries if config.retry_strategy == RetryStrategy.NATIVE else 0
