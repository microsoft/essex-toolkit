# Copyright 2024 Microsoft Corporation.

"""Tests for the caching.blob."""

import logging
from typing import Any
from unittest.mock import patch

import pytest
from fnllm.caching.blob import (
    BlobCache,
    InvalidBlobCacheArgumentsError,
    InvalidBlobContainerNameError,
    validate_blob_container_name,
)

logging.getLogger("azure.core.pipeline.policies.http_logging_policy").setLevel("ERROR")


def test_raises_on_invalid_arguments():
    with pytest.raises(InvalidBlobCacheArgumentsError):
        # No connection string or storage account blob url
        BlobCache(container_name="container")


def test_can_build_with_storage_account_blob_url():
    # No connection string, but with storage account blob url
    with patch("azure.identity.DefaultAzureCredential") as identity_patch:
        identity_patch.return_value = "some-credential"

        # Bogus credential is passed in, but it's not valid. Good enough for coverage.
        with pytest.raises(
            ValueError,
            match=r"Unable to determine account name for shared key credential.",
        ):
            BlobCache(
                container_name="container",
                storage_account_blob_url="https://127.0.0.1:10000",
            )


@pytest.mark.parametrize(
    argnames=("key_value"),
    argvalues=[
        (("str key", "str value")),
        (("int key", 10)),
        (("float key", 10.5)),
        (("object key", {"a": 1, "b": 2})),
    ],
)
async def test_default_operations(blob_cache: BlobCache, key_value: tuple[str, Any]):
    key, value = key_value

    # key, value is not there
    assert await blob_cache.has(key) is False
    assert await blob_cache.get(key) is None

    # adding key, value
    await blob_cache.set(key, value)
    assert await blob_cache.has(key) is True
    assert await blob_cache.get(key) == value
    assert type(await blob_cache.get(key)) is type(value)

    # removing key, value
    await blob_cache.remove(key)
    assert await blob_cache.has(key) is False
    assert await blob_cache.get(key) is None


async def test_replace_value(blob_cache: BlobCache):
    key, value = ("key", "value")
    other_value = "other value"

    # adding key, value
    await blob_cache.set(key, value)
    assert await blob_cache.has(key) is True
    assert await blob_cache.get(key) == value

    # replacing key value
    await blob_cache.set(key, other_value)
    assert await blob_cache.has(key) is True
    assert await blob_cache.get(key) == other_value


async def test_clear(blob_cache: BlobCache):
    # should start empty
    assert _is_container_empty(blob_cache) is True

    child = blob_cache.child("child")

    # BlobCache is still empty when creating child caches
    assert _is_container_empty(blob_cache) is True
    await child.set("key3", "value4")
    assert _is_container_empty(blob_cache) is False
    await blob_cache.clear()
    assert _is_container_empty(blob_cache) is True

    # filling cache, still not empty
    await blob_cache.set("key1", "value1")
    await blob_cache.set("key2", "value2")
    await blob_cache.set("key3", "value3")

    assert _is_container_empty(blob_cache) is False

    # still not empty
    assert _is_container_empty(blob_cache) is False

    # should be empty again after cleaning
    await blob_cache.clear()
    assert _is_container_empty(blob_cache) is True


async def test_children(blob_cache: BlobCache):
    # settings some values
    await blob_cache.set("test", "value")
    await blob_cache.set("test2", "value2")

    # creating child cache
    child = blob_cache.child("child")
    await child.set("test", "child_value")

    # previous values should still be there
    assert await blob_cache.get("test") == "value"
    assert await blob_cache.get("test2") == "value2"

    # child values are different
    assert await child.get("test") == "child_value"
    assert await child.has("test2") is False

    # access child value through parent
    assert await blob_cache.get("child/test") == "child_value"


def _is_container_empty(cache: BlobCache) -> bool:
    blobs = list(cache.container_client.list_blobs())
    return len(blobs) == 0


def test_container_name_validation():
    with pytest.raises(InvalidBlobContainerNameError):
        validate_blob_container_name("aa")

    with pytest.raises(InvalidBlobContainerNameError):
        validate_blob_container_name(
            "abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789"
        )

    with pytest.raises(InvalidBlobContainerNameError):
        validate_blob_container_name("no_underscores")

    with pytest.raises(InvalidBlobContainerNameError):
        validate_blob_container_name("no.dots")

    with pytest.raises(InvalidBlobContainerNameError):
        validate_blob_container_name("no--doublehyphens")

    with pytest.raises(InvalidBlobContainerNameError):
        validate_blob_container_name("notrailinghyphens-")

    with pytest.raises(InvalidBlobContainerNameError):
        validate_blob_container_name("-nostartinghypen")

    with pytest.raises(InvalidBlobContainerNameError):
        validate_blob_container_name("noCapitalLetters-")

    assert validate_blob_container_name("valid-name")
    assert validate_blob_container_name("validname123")
    assert validate_blob_container_name("123validname")


async def test_handles_common_errors(blob_cache: BlobCache):
    # Json Errors
    blob_cache.blob_client("json_error").upload_blob("""{ "data""")
    result = await blob_cache.get("json_error")
    assert result is None

    # Unicode Errors
    non_unicode_data = bytes([0x80, 0x81, 0x82])
    blob_cache.blob_client("unicode_error").upload_blob(non_unicode_data)
    result = await blob_cache.get("unicode_error")
    assert result is None
