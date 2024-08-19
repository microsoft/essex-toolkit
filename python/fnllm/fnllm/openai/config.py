# Copyright (c) 2024 Microsoft Corporation.


"""OpenAI Configuration class definition."""

from typing import Annotated, Literal

from pydantic import Field

from fnllm.config import Config
from fnllm.openai.types.chat.parameters import OpenAIChatParameters
from fnllm.openai.types.embeddings.parameters import OpenAIEmbeddingsParameters


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

    timeout: float | None = Field(default=None, description="The request timeout.")

    model: str = Field(default="", description="The OpenAI model to use.")

    encoding: str = Field(default="cl100k_base", description="The encoding model.")

    chat_parameters: OpenAIChatParameters = Field(
        default_factory=dict,
        description="Global chat parameters to be used across calls.",
    )

    embeddings_parameters: OpenAIEmbeddingsParameters = Field(
        default_factory=dict,
        description="Global embeddings parameters to be used across calls.",
    )

    sleep_on_rate_limit_recommendation: bool = Field(
        default=False,
        description="Whether to sleep on rate limit recommendation.",
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

    cognitive_services_endpoint: str = Field(
        default="https://cognitiveservices.azure.com/.default",
        description="The Azure Cognitive Services endpoint.",
    )


OpenAIConfig = Annotated[
    PublicOpenAIConfig | AzureOpenAIConfig, Field(discriminator="azure")
]
"""OpenAI configuration definition."""
