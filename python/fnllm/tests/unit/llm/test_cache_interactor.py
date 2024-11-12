# Copyright 2024 Microsoft Corporation.

"""Tests for llm.base."""

from unittest.mock import AsyncMock

from fnllm.caching.file import FileCache
from fnllm.services.cache_interactor import CacheInteractor
from pydantic import BaseModel


class CustomModel(BaseModel):
    attr1: str
    attr2: int


async def test_cache_interactor(file_cache: FileCache):
    llm = CacheInteractor(events=None, cache=file_cache)
    expected = CustomModel(attr1="test", attr2=10)
    func = AsyncMock(return_value=expected)

    # call and assert func will be called the first time
    result = await llm.get_or_insert(
        func,
        prefix="test",
        key_data={"a": 1, "b": "two"},
        name="name",
        json_model=CustomModel,
    )
    assert result == expected
    func.assert_called_once()

    # call and assert func will not be called
    # so the value is retrieved from the cache
    func.reset_mock()
    result = await llm.get_or_insert(
        func,
        prefix="test",
        key_data={"a": 1, "b": "two"},
        name="name",
        json_model=CustomModel,
    )
    assert result == expected
    func.assert_not_called()

    #
    # Call with a cache bypass
    #
    func.reset_mock()
    result = await llm.get_or_insert(
        func,
        prefix="test",
        key_data={"a": 1, "b": "two"},
        name="name",
        json_model=CustomModel,
        bypass_cache=True,
    )
    assert result == expected
    func.assert_called()

    # call with a different key data should not be a cache hit
    # so func should be called
    func.reset_mock()
    result = await llm.get_or_insert(
        func,
        prefix="test",
        key_data={"a": 2, "b": "two"},
        name="name",
        json_model=CustomModel,
    )
    assert result == expected
    func.assert_called_once()

    # different prefix should not be cache hit
    func.reset_mock()
    result = await llm.get_or_insert(
        func,
        prefix="test2",
        key_data={"a": 1, "b": "two"},
        name="name",
        json_model=CustomModel,
    )
    assert result == expected
    func.assert_called_once()


def test_cache_interactor_child_empty():
    llm = CacheInteractor(events=None, cache=None)
    child = llm.child("test")
    assert child is llm
