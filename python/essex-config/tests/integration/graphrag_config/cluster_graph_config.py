# Copyright (c) 2024 Microsoft Corporation.
# Licensed under the MIT License

"""Parameterization settings for the default configuration."""

from pydantic import BaseModel, Field

import tests.integration.graphrag_config.defaults as defs


class ClusterGraphConfig(BaseModel):
    """Configuration section for clustering graphs."""

    max_cluster_size: int = Field(
        description="The maximum cluster size to use.", default=defs.MAX_CLUSTER_SIZE
    )
    strategy: dict | None = Field(
        description="The cluster strategy to use.", default=None
    )
