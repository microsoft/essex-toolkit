# Copyright (c) 2024 Microsoft Corporation.
# Licensed under the MIT License

"""Parameterization settings for the default configuration."""

from typing import Annotated, Any

from pydantic import Field

import tests.integration.graphrag_config.defaults as defs
from essex_config.field_annotations import Parser
from essex_config.sources.utils import plain_text_list_parser

from .llm_config import LLMConfig


class EntityExtractionConfig(LLMConfig):
    """Configuration section for entity extraction."""

    prompt: str | None = Field(
        description="The entity extraction prompt to use.", default=None
    )
    entity_types: Annotated[list[str], Parser(plain_text_list_parser())] = Field(
        description="The entity extraction entity types to use.",
        default=defs.ENTITY_EXTRACTION_ENTITY_TYPES,
    )
    max_gleanings: int = Field(
        description="The maximum number of entity gleanings to use.",
        default=defs.ENTITY_EXTRACTION_MAX_GLEANINGS,
    )
    strategy: dict[str, Any] | None = Field(
        description="Override the default entity extraction strategy", default=None
    )
    encoding_model: str | None = Field(
        default=None, description="The encoding model to use."
    )
