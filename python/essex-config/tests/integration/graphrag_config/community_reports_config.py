# Copyright (c) 2024 Microsoft Corporation.
# Licensed under the MIT License

"""Parameterization settings for the default configuration."""

from pydantic import Field

import tests.integration.graphrag_config.defaults as defs

from .llm_config import LLMConfig


class CommunityReportsConfig(LLMConfig):
    """Configuration section for community reports."""

    prompt: str | None = Field(
        description="The community report extraction prompt to use.", default=None
    )
    max_length: int = Field(
        description="The community report maximum length in tokens.",
        default=defs.COMMUNITY_REPORT_MAX_LENGTH,
    )
    max_input_length: int = Field(
        description="The maximum input length in tokens to use when generating reports.",
        default=defs.COMMUNITY_REPORT_MAX_INPUT_LENGTH,
    )
    strategy: dict | None = Field(
        description="The override strategy to use.", default=None
    )
