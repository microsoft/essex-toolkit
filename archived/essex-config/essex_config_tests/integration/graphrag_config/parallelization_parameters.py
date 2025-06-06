# Copyright (c) 2025 Microsoft Corporation.
# Licensed under the MIT License

"""LLM Parameters model."""

from pydantic import BaseModel, Field

import essex_config_tests.integration.graphrag_config.defaults as defs


class ParallelizationParameters(BaseModel):
    """LLM Parameters model."""

    stagger: float = Field(
        description="The stagger to use for the LLM service.",
        default=defs.PARALLELIZATION_STAGGER,
    )
    num_threads: int = Field(
        description="The number of threads to use for the LLM service.",
        default=defs.PARALLELIZATION_NUM_THREADS,
    )
