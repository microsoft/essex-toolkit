"""Keyvault source class implementation."""

import os
from typing import Any

from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

from essex_config.sources.source import Source


class KeyvaultClient:
    """Class to interact with Azure Keyvault."""

    def __init__(self, keyvault_url: str | None):
        credential = DefaultAzureCredential()
        self.client: SecretClient = SecretClient(
            vault_url=keyvault_url if keyvault_url is not None else "",
            credential=credential,
        )

    def get_secret(self, secret_name: str) -> str | None:
        """Get the secret value."""
        return self.client.get_secret(secret_name).value

    def list_secrets(self) -> list[str]:
        """List all the secrets in the keyvault."""
        return [
            secret.name
            for secret in self.client.list_properties_of_secrets()
            if secret.name is not None
        ]


class KeyvaultSource(Source):
    """Class to get the configuration from Azure Keyvault."""

    def __init__(self, keyvault_name: str, use_env_var: bool = False) -> None:
        """Initialize the class."""
        self.keyvault_name = keyvault_name
        self.use_env_var = use_env_var

    def __get_keyvault_url(self) -> str | None:
        keyvault_name = (
            self.keyvault_name
            if not self.use_env_var
            else os.getenv(self.keyvault_name)
        )
        return f"https://{keyvault_name}.vault.azure.net/"

    def get_data(self) -> dict[str, Any]:
        """Get the data dictionary."""
        client = KeyvaultClient(self.__get_keyvault_url())
        return {secret: client.get_secret(secret) for secret in client.list_secrets()}

    def __str__(self) -> str:
        """Return the string representation of the class."""
        return f"KeyvaultSource(keyvault_name={self.keyvault_name},use_env_var={self.use_env_var})"
