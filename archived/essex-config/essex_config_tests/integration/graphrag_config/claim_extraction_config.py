# Copyright (c) 2024 Microsoft Corporation.
# Licensed under the MIT License

"""Parameterization settings for the default configuration."""

from typing import Any

from pydantic import Field

import essex_config_tests.integration.graphrag_config.defaults as defs

from .llm_config import LLMConfig


class ClaimExtractionConfig(LLMConfig):
    """Configuration section for claim extraction."""

    enabled: bool = Field(
        description="Whether claim extraction is enabled.",
        default=defs.CLAIM_EXTRACTION_ENABLED,
    )
    prompt: str | None = Field(
        description="The claim extraction prompt to use.", default=None
    )
    description: str = Field(
        description="The claim description to use.",
        default=defs.CLAIM_DESCRIPTION,
    )
    max_gleanings: int = Field(
        description="The maximum number of entity gleanings to use.",
        default=defs.CLAIM_MAX_GLEANINGS,
    )
    strategy: dict[str, Any] | None = Field(
        description="The override strategy to use.", default=None
    )
    encoding_model: str | None = Field(
        default=None, description="The encoding model to use."
    )
