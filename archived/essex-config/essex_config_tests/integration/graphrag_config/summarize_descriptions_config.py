# Copyright (c) 2024 Microsoft Corporation.
# Licensed under the MIT License

"""Parameterization settings for the default configuration."""

from typing import Any

from pydantic import Field

import essex_config_tests.integration.graphrag_config.defaults as defs

from .llm_config import LLMConfig


class SummarizeDescriptionsConfig(LLMConfig):
    """Configuration section for description summarization."""

    prompt: str | None = Field(
        description="The description summarization prompt to use.", default=None
    )
    max_length: int = Field(
        description="The description summarization maximum length.",
        default=defs.SUMMARIZE_DESCRIPTIONS_MAX_LENGTH,
    )
    strategy: dict[str, Any] | None = Field(
        description="The override strategy to use.", default=None
    )
