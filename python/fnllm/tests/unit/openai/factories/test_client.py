# Copyright 2024 Microsoft Corporation.

"""Tests for openai.factories.client."""

from unittest.mock import Mock

import pytest
from fnllm.openai.config import AzureOpenAIConfig, PublicOpenAIConfig
from fnllm.openai.factories.client import create_openai_client
from fnllm.openai.factories.create_azure_openai_client import (
    CredentialRequiredError,
    create_azure_openai_client,
)
from openai import AsyncAzureOpenAI, AsyncOpenAI


def test_create_azure_client():
    config = AzureOpenAIConfig(
        api_key="key",
        organization="organization",
        api_version="api_version",
        endpoint="endpoint",
        deployment="deployment",
        timeout=200,
    )
    client = create_openai_client(config)

    # should be an azure client instance
    assert isinstance(client, AsyncAzureOpenAI)

    # check configs have been propagated
    assert client.api_key == config.api_key
    assert client.organization == config.organization
    assert client.default_query.get("api-version", None) == config.api_version
    assert client.base_url == _enforce_trailing_slash(
        f"{config.endpoint}/openai/deployments/{config.deployment}"
    )
    assert client.timeout == config.timeout
    assert client.max_retries == 0


def test_create_azure_client_with_no_credential_or_key_raises():
    config = AzureOpenAIConfig(
        organization="organization",
        api_version="api_version",
        endpoint="endpoint",
        deployment="deployment",
        timeout=200,
    )
    with pytest.raises(CredentialRequiredError):
        create_azure_openai_client(config)


def test_can_create_azure_client_with_credential():
    config = AzureOpenAIConfig(
        organization="organization",
        api_version="api_version",
        endpoint="endpoint",
        deployment="deployment",
        timeout=200,
    )
    credential = Mock()
    result = create_azure_openai_client(config, credential=credential)
    assert isinstance(result, AsyncAzureOpenAI)


def test_create_public_client():
    config = PublicOpenAIConfig(
        api_key="key", base_url="base_url", organization="organization", timeout=200
    )
    client = create_openai_client(config)

    # should be an public client instance
    assert isinstance(client, AsyncOpenAI)

    # check configs have been propagated
    assert client.api_key == config.api_key
    assert client.base_url == _enforce_trailing_slash(config.base_url)
    assert client.organization == config.organization
    assert client.timeout == config.timeout
    assert client.max_retries == 0


def _enforce_trailing_slash(url: str | None) -> str | None:
    if url is None or url.endswith("/"):
        return url
    return f"{url}/"
