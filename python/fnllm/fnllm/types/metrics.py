# Copyright (c) 2024 Microsoft Corporation.

"""LLM input/output types."""

from pydantic import BaseModel, Field, computed_field


class LLMUsageMetrics(BaseModel):
    """LLM request usage metrics."""

    input_tokens: int = 0
    """Used input tokens by the request."""

    output_tokens: int = 0
    """Used output tokens by the request."""

    @computed_field()
    @property
    def total_tokens(self) -> int:
        """Total tokens used by the request."""
        return self.input_tokens + self.output_tokens


class LLMRetryMetrics(BaseModel):
    """Metrics related to LLM retries."""

    num_retries: int = 0
    """Number of times the request was retried."""

    total_time: float = 0
    """Total time the request took to execute (across all retries)."""

    call_times: list[float] = Field(default_factory=list)
    """Time taken for each request try."""


class LLMMetrics(BaseModel):
    """LLM useful metrics."""

    estimated_input_tokens: int = 0
    """Estimated input tokens."""

    usage: LLMUsageMetrics = Field(default_factory=LLMUsageMetrics)
    """LLM request usage metrics."""

    retry: LLMRetryMetrics = Field(default_factory=LLMRetryMetrics)
    """LLM retry metrics."""

    @computed_field()
    @property
    def tokens_diff(self) -> int:
        """Difference between the estimated tokens and the real total token usage."""
        return self.usage.total_tokens - self.estimated_input_tokens
