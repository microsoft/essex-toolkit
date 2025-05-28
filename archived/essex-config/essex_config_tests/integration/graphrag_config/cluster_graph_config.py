# Copyright (c) 2025 Microsoft Corporation.
# Licensed under the MIT License

"""Parameterization settings for the default configuration."""

from typing import Any

from pydantic import BaseModel, Field

import essex_config_tests.integration.graphrag_config.defaults as defs


class ClusterGraphConfig(BaseModel):
    """Configuration section for clustering graphs."""

    max_cluster_size: int = Field(
        description="The maximum cluster size to use.", default=defs.MAX_CLUSTER_SIZE
    )
    strategy: dict[str, Any] | None = Field(
        description="The cluster strategy to use.", default=None
    )
