# Copyright 2024 Microsoft Corporation.

"""Tests for llm.base."""

from typing import Any
from unittest.mock import Mock

import pytest
from pydantic import BaseModel
from typing_extensions import Unpack

from fnllm.llm.base import BaseLLM
from fnllm.llm.events.base import LLMEvents
from fnllm.llm.types.io import LLMInput


class CustomError(BaseException):
    pass


class ErrorLLM(BaseLLM[str, str, Any, Any]):
    async def _execute_llm(
        self,
        prompt: str,
        **kwargs: Unpack[LLMInput[Any, Any, Any]],
    ) -> str:
        msg = "Test error."
        raise CustomError(msg)


class CustomLLM(BaseLLM[str, str, Any, Any]):
    async def _execute_llm(
        self,
        prompt: str,
        **kwargs: Unpack[LLMInput[Any, Any, Any]],
    ) -> str:
        return "Some result."


class CustomModel(BaseModel):
    attr1: str
    attr2: int


async def test_on_error():
    mocked_events = Mock(LLMEvents)

    llm = ErrorLLM(events=mocked_events, cache=None)

    assert llm.events == mocked_events

    with pytest.raises(CustomError):
        await llm("test")

    mocked_events.on_error.assert_called_once()
