# Copyright (c) 2025 Microsoft Corporation.
# Licensed under the MIT License

"""Parameterization settings for the default configuration."""

from pydantic import BaseModel, Field

from .llm_parameters import LLMParameters
from .parallelization_parameters import ParallelizationParameters


class LLMConfig(BaseModel):
    """Base class for LLM-configured steps."""

    llm: LLMParameters = Field(
        description="The LLM configuration to use.", default=LLMParameters()
    )
    parallelization: ParallelizationParameters = Field(
        description="The parallelization configuration to use.",
        default=ParallelizationParameters(),
    )
