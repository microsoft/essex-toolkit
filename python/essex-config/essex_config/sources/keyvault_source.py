"""Keyvault source class implementation."""

import os
from functools import cache, cached_property
from typing import Any

from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

from essex_config.sources.source import Source


class KeyvaultClient:  # pragma: no cover
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

    @cached_property
    def secrets(self) -> set[str]:
        """List all the secrets in the keyvault."""
        return {
            secret.name
            for secret in self.client.list_properties_of_secrets()
            if secret.name is not None
        }

    @classmethod
    @cache
    def get_keyvault_client(cls, keyvault_name: str) -> "KeyvaultClient":
        """Get the keyvault client."""
        keyvault_url = f"https://{keyvault_name}.vault.azure.net/"
        return cls(keyvault_url)


class KeyvaultSource(Source):
    """Class to get the configuration from Azure Keyvault."""

    def __init__(
        self,
        keyvault_name: str,
        use_env_var: bool = False,
        prefix: str | None = None,
    ) -> None:
        """Initialize the class."""
        super().__init__(prefix)
        self.keyvault_name = keyvault_name
        self.use_env_var = use_env_var

    def __get_keyvault_url(self) -> str | None:
        keyvault_name = (
            self.keyvault_name
            if not self.use_env_var
            else os.getenv(self.keyvault_name)
        )
        return f"https://{keyvault_name}.vault.azure.net/"

    def _get_value(self, key: str) -> Any:
        """Get the value from the keyvault."""
        client = KeyvaultClient.get_keyvault_client(self.__get_keyvault_url())
        return client.get_secret(key)

    def __contains__(self, key: str) -> bool:
        """Check if the key is present in the keyvault."""
        client = KeyvaultClient.get_keyvault_client(self.__get_keyvault_url())
        return key in client.secrets

    def __repr__(self) -> str:
        """Return the string representation of the class."""
        return f"KeyvaultSource(keyvault_name={self.keyvault_name},use_env_var={self.use_env_var})"
