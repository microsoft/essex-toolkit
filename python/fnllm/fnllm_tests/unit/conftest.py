# Copyright 2024 Microsoft Corporation.

"""General utilities."""

import pathlib
from collections.abc import Generator
from typing import Any

import pytest
from fnllm.caching.blob import BlobCache
from fnllm.caching.file import FileCache

# cspell:disable-next-line well-known-key
WELL_KNOWN_AZURITE_CONNECTION_STRING = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1"


@pytest.fixture
def file_cache(tmp_path: pathlib.Path) -> FileCache:
    return FileCache(tmp_path)


@pytest.fixture
def blob_cache() -> Generator[BlobCache, Any, Any]:
    cache = BlobCache(
        connection_string=WELL_KNOWN_AZURITE_CONNECTION_STRING,
        container_name="test-container",
    )
    yield cache
    cache.delete_container()
