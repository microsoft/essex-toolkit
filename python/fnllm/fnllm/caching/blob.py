# Copyright (c) 2024 Microsoft Corporation.

"""Azure Blob Storage Cache."""

import json
import re
from pathlib import Path
from typing import Any

from azure.core.exceptions import ResourceNotFoundError
from azure.storage.blob import BlobClient, BlobServiceClient, ContainerClient

from .base import Cache


class InvalidBlobContainerNameError(ValueError):
    """Raised when an invalid blob container name is provided."""

    def __init__(self, message: str):
        """Create a new InvalidBlobContainerNameError."""
        super().__init__(message)


class InvalidBlobCacheArgumentsError(ValueError):
    """Raised when invalid blob cache arguments are provided."""

    def __init__(self, message: str):
        """Create a new InvalidBlobContainerNameError."""
        super().__init__(message)


class BlobCache(Cache):
    """
    The Blob-Storage implementation.

    Note that this implementation does not track audit fields "created" and "accessed", since these are natively available in Azure Blob Storage.
    """

    _connection_string: str | None
    _container_name: str
    _path_prefix: str
    _encoding: str
    _storage_account_blob_url: str | None

    def __init__(
        self,
        *,
        connection_string: str | None = None,
        container_name: str,
        encoding: str | None = None,
        path_prefix: str | None = None,
        storage_account_blob_url: str | None = None,
    ):
        """Create a new BlobStorage instance."""
        if connection_string:
            self._blob_service_client = BlobServiceClient.from_connection_string(
                connection_string
            )
        else:
            from azure.identity import DefaultAzureCredential

            if storage_account_blob_url is None:
                msg = "Either connection_string or storage_account_blob_url must be provided."
                raise InvalidBlobCacheArgumentsError(msg)

            self._blob_service_client = BlobServiceClient(
                account_url=storage_account_blob_url,
                credential=DefaultAzureCredential(),
            )

        validate_blob_container_name(container_name)
        self._encoding = encoding or "utf-8"
        self._container_name = container_name
        self._connection_string = connection_string
        self._path_prefix = path_prefix or ""
        self._storage_account_blob_url = storage_account_blob_url
        self._storage_account_name = (
            storage_account_blob_url.split("//")[1].split(".")[0]
            if storage_account_blob_url
            else None
        )
        self.create_container()

    @property
    def container_name(self) -> str:
        """Get the container name."""
        return self._container_name

    @property
    def blob_service_client(self) -> BlobServiceClient:
        """Get the blob service client."""
        return self._blob_service_client

    @property
    def container_client(self) -> ContainerClient:
        """Get the container client."""
        return self.blob_service_client.get_container_client(self.container_name)

    def blob_client(self, name: str) -> BlobClient:
        """Get a blob client."""
        return self.container_client.get_blob_client(name)

    def container_exists(self) -> bool:
        """Check if the container exists."""
        container_name = self.container_name
        container_names = [
            container.name for container in self.blob_service_client.list_containers()
        ]
        return container_name in container_names

    def create_container(self) -> None:
        """Create the container if it does not exist."""
        if not self.container_exists():
            self.blob_service_client.create_container(self.container_name)

    def delete_container(self) -> None:
        """Delete the container."""
        if self.container_exists():
            self.blob_service_client.delete_container(self.container_name)

    async def has(self, key: str) -> bool:
        """Check if a key exists in the cache."""
        key = self._keyname(key)
        blob_client = self.blob_client(key)
        return blob_client.exists()

    async def get(self, key: str) -> Any | None:
        """Get a value from the cache."""
        try:
            key = self._keyname(key)
            blob_client = self.blob_client(key)
            blob_data = blob_client.download_blob().readall()
        except ResourceNotFoundError:
            return None
        else:
            try:
                blob_data = blob_data.decode(self._encoding)
                data = json.loads(blob_data)
            except json.JSONDecodeError:
                return None
            except UnicodeDecodeError:
                return None
            else:
                return data["result"]

    async def set(
        self, key: str, value: Any, metadata: dict[str, Any] | None = None
    ) -> None:
        """Set a value in the cache."""
        key = self._keyname(key)
        content = json.dumps(
            {"result": value, "metadata": metadata}, indent=2, ensure_ascii=False
        )
        blob_client = self.blob_client(key)
        blob_client.upload_blob(content.encode(self._encoding), overwrite=True)

    async def remove(self, key: str) -> None:
        """Delete a key from the cache."""
        key = self._keyname(key)
        blob_client = self.blob_client(key)
        blob_client.delete_blob()

    async def clear(self) -> None:
        """Clear the cache."""
        for blob in [*self.container_client.list_blob_names()]:
            self.blob_client(blob).delete_blob()

    def child(self, key: str) -> "BlobCache":
        """Create a child storage instance."""
        path = str(Path(self._path_prefix) / key)
        return BlobCache(
            connection_string=self._connection_string,
            container_name=self.container_name,
            encoding=self._encoding,
            path_prefix=path,
            storage_account_blob_url=self._storage_account_blob_url,
        )

    def _keyname(self, key: str) -> str:
        """Get the key name."""
        return str(Path(self._path_prefix) / key)


def validate_blob_container_name(container_name: str) -> bool:
    """Check if the provided blob container name is valid based on Azure rules.

        - A blob container name must be between 3 and 63 characters in length.
        - Start with a letter or number
        - All letters used in blob container names must be lowercase.
        - Contain only letters, numbers, or the hyphen.
        - Consecutive hyphens are not permitted.
        - Cannot end with a hyphen.


    container_name (str)
        The blob container name to be validated.

    Returns
    -------
        bool: True if valid, raises otherwise.
    """
    # Check the length of the name
    if len(container_name) < 3 or len(container_name) > 63:
        msg = f"Container name must be between 3 and 63 characters in length. Name provided was {len(container_name)} characters long."
        raise InvalidBlobContainerNameError(msg)

    # Check if the name starts with a letter or number
    if not container_name[0].isalnum():
        msg = f"Container name must start with a letter or number. Starting character was {container_name[0]}."
        raise InvalidBlobContainerNameError(msg)

    # Check for valid characters (letters, numbers, hyphen) and lowercase letters
    if not re.match(r"^[a-z0-9-]+$", container_name):
        msg = f"Container name must only contain:\n- lowercase letters\n- numbers\n- or hyphens\nName provided was {container_name}."
        raise InvalidBlobContainerNameError(msg)

    # Check for consecutive hyphens
    if "--" in container_name:
        msg = f"Container name cannot contain consecutive hyphens. Name provided was {container_name}."
        raise InvalidBlobContainerNameError(msg)

    # Check for hyphens at the end of the name
    if container_name[-1] == "-":
        msg = f"Container name cannot end with a hyphen. Name provided was {container_name}."
        raise InvalidBlobContainerNameError(msg)

    return True
