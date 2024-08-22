# Copyright (c) 2024 Microsoft Corporation.
# Licensed under the MIT License

"""Parameterization settings for the default configuration."""

from typing import Any

from pydantic import BaseModel, Field

import tests.integration.graphrag_config.defaults as defs


class EmbedGraphConfig(BaseModel):
    """The default configuration section for Node2Vec."""

    enabled: bool = Field(
        description="A flag indicating whether to enable node2vec.",
        default=defs.NODE2VEC_ENABLED,
    )
    num_walks: int = Field(
        description="The node2vec number of walks.", default=defs.NODE2VEC_NUM_WALKS
    )
    walk_length: int = Field(
        description="The node2vec walk length.", default=defs.NODE2VEC_WALK_LENGTH
    )
    window_size: int = Field(
        description="The node2vec window size.", default=defs.NODE2VEC_WINDOW_SIZE
    )
    iterations: int = Field(
        description="The node2vec iterations.", default=defs.NODE2VEC_ITERATIONS
    )
    random_seed: int = Field(
        description="The node2vec random seed.", default=defs.NODE2VEC_RANDOM_SEED
    )
    strategy: dict[str, Any] | None = Field(
        description="The graph embedding strategy override.", default=None
    )
