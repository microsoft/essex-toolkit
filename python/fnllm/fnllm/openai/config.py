# Copyright (c) 2025 Microsoft Corporation.


"""OpenAI Configuration class definition."""

from enum import Enum
from typing import Annotated, Literal

from pydantic import Field

from fnllm.base.config import Config
from fnllm.openai.types.chat.parameters import OpenAIChatParameters
from fnllm.openai.types.embeddings.parameters import OpenAIEmbeddingsParameters


class OpenAIRateLimitBehavior(str, Enum):
    """The behavior to use when a RateLimitError is encountered."""

    NONE = "none"
    """Do nothing when a rate limit is encountered"""

    LIMIT = "limit"
    """Use the limiter stack to block requests until the ratelimit time has elapsed."""

    SLEEP = "sleep"
    """Perform a task-local sleep until the ratelimit time has elapsed."""


class CommonOpenAIConfig(Config, frozen=True, extra="allow", protected_namespaces=()):
    """Common configuration parameters between Azure OpenAI and Public OpenAI."""

    azure: bool = Field(default=False, description="Whether to use Azure OpenAI.")

    api_key: str | None = Field(default=None, description="The OpenAI API key.")

    track_stream_usage: bool = Field(
        default=False, description="Whether to emit stream usage."
    )

    organization: str | None = Field(
        default=None, description="The OpenAI organization."
    )

    timeout: float = Field(default=180.0, description="The request timeout (s).")

    model: str = Field(default="", description="The OpenAI model to use.")

    encoding: str = Field(default="cl100k_base", description="The encoding model.")

    chat_parameters: OpenAIChatParameters = Field(
        default_factory=OpenAIChatParameters,
        description="Global chat parameters to be used across calls.",
    )

    embeddings_parameters: OpenAIEmbeddingsParameters = Field(
        default_factory=OpenAIEmbeddingsParameters,
        description="Global embeddings parameters to be used across calls.",
    )

    rate_limit_behavior: OpenAIRateLimitBehavior = Field(
        default=OpenAIRateLimitBehavior.LIMIT,
        description="The rate-limiting behavior to employ when a RateLimitError is encountered.",
    )


class PublicOpenAIConfig(
    CommonOpenAIConfig, frozen=True, extra="allow", protected_namespaces=()
):
    """Public OpenAI configuration definition."""

    azure: Literal[False] = Field(
        default=False, description="Whether to use Azure OpenAI."
    )

    base_url: str | None = Field(default=None, description="The OpenAI API base URL.")


class AzureOpenAIConfig(
    CommonOpenAIConfig, frozen=True, extra="allow", protected_namespaces=()
):
    """Azure OpenAI configuration definition."""

    azure: Literal[True] = Field(
        default=True, description="Whether to use Azure OpenAI."
    )

    endpoint: str = Field(description="The OpenAI API endpoint.")

    deployment: str | None = Field(
        default=None, description="The Azure deployment name."
    )

    api_version: str | None = Field(description="The OpenAI API version.")

    audience: str = Field(
        default="https://cognitiveservices.azure.com/.default",
        description="The Azure OpenAI Audience.",
    )


OpenAIConfig = Annotated[
    PublicOpenAIConfig | AzureOpenAIConfig, Field(discriminator="azure")
]
"""OpenAI configuration definition."""
