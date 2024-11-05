# Copyright (c) 2024 Microsoft Corporation.


"""LLM Configuration Protocol definition."""

from pydantic import BaseModel, Field

from .json_strategy import JsonStrategy


class Config(BaseModel, frozen=True, extra="allow"):
    """Configuration protocol definition."""

    max_retries: int = Field(
        default=10,
        description="The maximum number of retries.",
    )

    max_json_retries: int = Field(
        default=3, description="The maximum number of retries for JSON generation."
    )

    max_retry_wait: float = Field(
        default=10, description="The maximum retry wait time."
    )

    max_concurrency: int | None = Field(
        default=None,
        description="The maximum concurrency. This is the number of concurrent requests that can be made at once.",
    )

    tokens_per_minute: int | None = Field(
        default=None, description="The max number of tokens per minute."
    )

    requests_per_minute: int | None = Field(
        default=None,
        description="The max number of requests per minute.",
    )

    requests_burst_mode: bool = Field(
        default=True, description="Use burst mode when submitting requests."
    )

    json_strategy: JsonStrategy = Field(
        default=JsonStrategy.VALID,
        description="The strategy to use for JSON parsing.",
    )
