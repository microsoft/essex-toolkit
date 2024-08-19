# Copyright (c) 2024 Microsoft Corporation.

"""Create OpenAI client instance."""

from typing import cast

from openai import AsyncAzureOpenAI, AsyncOpenAI

from fnllm.openai.config import AzureOpenAIConfig, OpenAIConfig, PublicOpenAIConfig
from fnllm.openai.types.client import OpenAIClient


def create_openai_client(config: OpenAIConfig) -> OpenAIClient:
    """Create a new OpenAI client instance."""
    if config.azure:
        from azure.identity import DefaultAzureCredential, get_bearer_token_provider

        config = cast(AzureOpenAIConfig, config)

        token_provider = (
            get_bearer_token_provider(
                DefaultAzureCredential(), config.cognitive_services_endpoint
            )
            if not config.api_key
            else None
        )

        return AsyncAzureOpenAI(
            api_key=config.api_key,
            azure_ad_token_provider=token_provider,
            organization=config.organization,
            # Azure-Specifics
            api_version=config.api_version,
            azure_endpoint=config.endpoint,
            azure_deployment=config.deployment,
            timeout=config.timeout,
            max_retries=0,
        )

    config = cast(PublicOpenAIConfig, config)

    return AsyncOpenAI(
        api_key=config.api_key,
        base_url=config.base_url,
        organization=config.organization,
        timeout=config.timeout,
        max_retries=0,
    )
