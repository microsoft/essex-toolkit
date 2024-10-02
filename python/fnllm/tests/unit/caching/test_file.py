# Copyright 2024 Microsoft Corporation.

"""Tests for the caching.file."""

import os
import pathlib
from typing import Any

import pytest
from fnllm.caching.file import FileCache


@pytest.fixture
def cache_from_str(tmp_path: pathlib.Path) -> FileCache:
    return FileCache(str(tmp_path.absolute()))


@pytest.mark.parametrize(
    argnames=("key_value"),
    argvalues=[
        (("str key", "str value")),
        (("int key", 10)),
        (("float key", 10.5)),
        (("object key", {"a": 1, "b": 2})),
    ],
)
async def test_default_operations(file_cache: FileCache, key_value: tuple[str, Any]):
    key, value = key_value

    # key, value is not there
    assert await file_cache.has(key) is False
    assert await file_cache.get(key) is None

    # adding key, value
    await file_cache.set(key, value)
    assert await file_cache.has(key) is True
    assert await file_cache.get(key) == value
    assert type(await file_cache.get(key)) is type(value)

    # removing key, value
    await file_cache.remove(key)
    assert await file_cache.has(key) is False
    assert await file_cache.get(key) is None


async def test_replace_value(file_cache: FileCache):
    key, value = ("key", "value")
    other_value = "other value"

    # adding key, value
    await file_cache.set(key, value)
    assert await file_cache.has(key) is True
    assert await file_cache.get(key) == value

    # replacing key value
    await file_cache.set(key, other_value)
    assert await file_cache.has(key) is True
    assert await file_cache.get(key) == other_value


async def test_clear(file_cache: FileCache):
    # should start empty
    assert _is_dir_empty(file_cache.root_path) is True

    child = file_cache.child("child")

    # has the child cache, so should no longer be empty
    assert _is_dir_empty(file_cache.root_path) is False

    # filling cache, still not empty
    await file_cache.set("key1", "value1")
    await file_cache.set("key2", "value2")
    await file_cache.set("key3", "value3")
    await child.set("key3", "value4")

    # still not empty
    assert _is_dir_empty(file_cache.root_path) is False

    # should be empty again after cleaning
    await file_cache.clear()
    assert _is_dir_empty(file_cache.root_path) is True


async def test_children(file_cache: FileCache):
    # settings some values
    await file_cache.set("test", "value")
    await file_cache.set("test2", "value2")

    # creating child cache
    child = file_cache.child("child")
    await child.set("test", "child_value")

    # previous values should still be there
    assert await file_cache.get("test") == "value"
    assert await file_cache.get("test2") == "value2"

    # child values are different
    assert await child.get("test") == "child_value"
    assert await child.has("test2") is False

    # access child value through parent
    assert await file_cache.get("child/test") == "child_value"


async def test_create_from_str(cache_from_str: FileCache):
    await cache_from_str.set("key", "value")
    assert await cache_from_str.get("key") == "value"


def _is_dir_empty(path: pathlib.Path) -> bool:
    return not any(os.scandir(path))
