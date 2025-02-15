# Copyright 2024 Microsoft Corporation.

"""Tests for llm.base."""

from typing import Any
from unittest.mock import Mock

import pytest
from fnllm.base.base_llm import BaseLLM
from fnllm.events.base import LLMEvents
from fnllm.types.io import LLMInput
from pydantic import BaseModel


class CustomError(BaseException):
    pass


class ErrorLLM(BaseLLM[str, str, Any, Any]):
    async def _execute_llm(
        self,
        prompt: str,
        kwargs: LLMInput[Any, Any, Any],
    ) -> str:
        msg = "Test error."
        raise CustomError(msg)

    def is_reasoning_model(self) -> bool:
        return False


class CustomLLM(BaseLLM[str, str, Any, Any]):
    async def _execute_llm(
        self,
        prompt: str,
        kwargs: LLMInput[Any, Any, Any],
    ) -> str:
        return "Some result."

    def is_reasoning_model(self) -> bool:
        return False


class CustomModel(BaseModel):
    attr1: str
    attr2: int


async def test_on_error():
    mocked_events = Mock(LLMEvents)

    llm = ErrorLLM(events=mocked_events)

    assert llm.events == mocked_events

    with pytest.raises(CustomError):
        await llm("test")

    mocked_events.on_error.assert_called_once()


def test_clone_empty():
    llm = CustomLLM()
    child = llm.child("test")

    # No cache, child == llm
    assert child is llm


def test_clone_valid():
    llm = CustomLLM(cached=Mock())
    child = llm.child("test")
    # Cache, child is not llm
    assert child is not llm
