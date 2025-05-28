# Copyright (c) 2025 Microsoft Corporation.
# Licensed under the MIT License

"""Parameterization settings for the default configuration."""

from typing import Any

from pydantic import BaseModel, Field

import essex_config_tests.integration.graphrag_config.defaults as defs


class ChunkingConfig(BaseModel):
    """Configuration section for chunking."""

    size: int = Field(description="The chunk size to use.", default=defs.CHUNK_SIZE)
    overlap: int = Field(
        description="The chunk overlap to use.", default=defs.CHUNK_OVERLAP
    )
    group_by_columns: list[str] = Field(
        description="The chunk by columns to use.",
        default=defs.CHUNK_GROUP_BY_COLUMNS,
    )
    strategy: dict[str, Any] | None = Field(
        description="The chunk strategy to use, overriding the default tokenization strategy",
        default=None,
    )
    encoding_model: str | None = Field(
        default=None, description="The encoding model to use."
    )
