# Copyright 2024 Microsoft Corporation.

"""General utilities."""

import pathlib

import pytest

from fnllm.caching.file import FileCache


@pytest.fixture
def cache(tmp_path: pathlib.Path) -> FileCache:
    return FileCache(tmp_path)
