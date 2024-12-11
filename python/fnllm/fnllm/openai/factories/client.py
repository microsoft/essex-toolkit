# Copyright (c) 2024 Microsoft Corporation.

"""Create OpenAI client instance."""

from typing import Any, cast

from openai import AsyncOpenAI

from fnllm.openai.config import AzureOpenAIConfig, OpenAIConfig, PublicOpenAIConfig
from fnllm.openai.types.client import OpenAIClient


def create_openai_client(
    config: OpenAIConfig, *, credential: Any | None = None
) -> OpenAIClient:
    """Create a new OpenAI client instance."""
    if config.azure:
        from .create_azure_openai_client import (
            TokenProvider,
            create_azure_openai_client,
        )

        config = cast(AzureOpenAIConfig, config)
        credential = cast(TokenProvider | None, credential)
        return create_azure_openai_client(config, credential=credential)

    return create_public_openai_client(cast(PublicOpenAIConfig, config))


def create_public_openai_client(config: PublicOpenAIConfig) -> OpenAIClient:
    """Create a new OpenAI client instance."""
    return AsyncOpenAI(
        api_key=config.api_key,
        base_url=config.base_url,
        organization=config.organization,
        timeout=config.timeout,
        max_retries=0,
    )
