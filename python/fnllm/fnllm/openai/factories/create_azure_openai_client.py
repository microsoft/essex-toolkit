# Copyright (c) 2024 Microsoft Corporation.

"""Create OpenAI client instance."""

from azure.core.credentials import TokenProvider
from azure.identity import (
    get_bearer_token_provider,
)
from openai import AsyncAzureOpenAI
from openai.lib.azure import AsyncAzureADTokenProvider

from fnllm.openai.config import AzureOpenAIConfig
from fnllm.openai.types.client import OpenAIClient


class CredentialRequiredError(ValueError):
    """Credential is required for Azure OpenAI when key is not present."""

    def __init__(self) -> None:
        super().__init__(
            "Credential is required for Azure OpenAI when key is not present."
        )


def create_azure_openai_client(
    config: AzureOpenAIConfig, *, credential: TokenProvider | None = None
) -> OpenAIClient:
    """Create a new OpenAI client instance."""
    return AsyncAzureOpenAI(
        api_key=config.api_key,
        azure_ad_token_provider=_get_azure_ad_token_provider(config, credential),
        organization=config.organization,
        # Azure-Specifics
        api_version=config.api_version,
        azure_endpoint=config.endpoint,
        azure_deployment=config.deployment,
        timeout=config.timeout,
        max_retries=0,
    )


def _get_azure_ad_token_provider(
    config: AzureOpenAIConfig, credential: TokenProvider | None = None
) -> AsyncAzureADTokenProvider | None:
    """Get Azure AD token provider."""
    if config.api_key is not None:
        return None

    if credential is None:
        raise CredentialRequiredError

    return get_bearer_token_provider(credential, config.cognitive_services_endpoint)
