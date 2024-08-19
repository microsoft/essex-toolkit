# Copyright (c) 2024 Microsoft Corporation.

"""Tests for openai.llm.features.json_parsing."""

import json
from typing import Any, cast
from unittest.mock import AsyncMock

import pytest
from pydantic import BaseModel

from fnllm.llm.base import BaseLLM
from fnllm.llm.services.errors import FailedToGenerateValidJsonError
from fnllm.llm.services.json import (
    JsonHandler,
    JsonMarshaler,
    JsonReceiver,
    JsonRequester,
    LooseModeJsonReceiver,
)
from fnllm.llm.types.io import LLMInput, LLMOutput


class TestOutput(BaseModel):
    """OpenAI chat completion output."""

    content: str | None


class TestLLM(BaseLLM):
    def __init__(
        self,
        json_handler: JsonHandler,
        output: Any,
        on_execute: AsyncMock | None = None,
    ):
        super().__init__(json_handler=json_handler)
        self._output = output
        self._on_execute = on_execute or AsyncMock()

    @property
    def inner(self) -> AsyncMock:
        return self._on_execute

    async def _decorator_target(self, prompt: Any, **kwargs: Any) -> Any:
        return self._output

    def _execute_llm(self, prompt: Any, **kwargs: Any) -> Any:
        self._on_execute(prompt, **kwargs)


class TestMarshaler(JsonMarshaler):
    def inject_json_string(
        self,
        json_string: str | None,
        output: LLMOutput,
    ) -> LLMOutput:
        """Inject the JSON string into the output."""
        output.output.content = json_string
        return output

    def extract_json_string(self, output: LLMOutput) -> str | None:
        """Extract the JSON string from the output."""
        return output.output.content


class TestReceiver(LooseModeJsonReceiver):
    __test__ = False  # this is not a pytest class

    def __init__(self, recovery=None):
        super().__init__(TestMarshaler())
        self._recovery = recovery

    async def _try_recovering_malformed_json(
        self,
        err: FailedToGenerateValidJsonError,
        json_string: str | None,
        prompt: Any,
        kwargs: Any,
    ) -> tuple[str | None, Any | None, Any | None]:
        """Try to recover from a bad JSON error. Null JSON = unable to recover."""
        if self._recovery is not None:
            return await self._recovery(err, json_string, prompt, kwargs)
        return await super()._try_recovering_malformed_json(
            err, json_string, prompt, kwargs
        )


class TestRequester(JsonRequester):
    def __init__(self):
        self.num_rewrites = 0

    def rewrite_args(self, prompt: str, kwargs: LLMInput) -> tuple[str, LLMInput]:
        self.num_rewrites += 1
        return prompt + "test", {**kwargs, "model_parameters": {"test": "xyz"}}


class CustomModel(BaseModel):
    integer: int
    string: str


async def test_requester_rewrites_for_json():
    requester = TestRequester()
    llm = TestLLM(
        json_handler=JsonHandler(requester, None),
        output=LLMOutput(output=TestOutput(content="")),
    )

    # call the llm and assert result
    await llm("prompt", json=True)
    assert requester.num_rewrites == 1


async def test_requester_does_not_rewrite_non_json():
    requester = TestRequester()
    llm = TestLLM(
        json_handler=JsonHandler(requester, None),
        output=LLMOutput(output=TestOutput(content="")),
    )

    # call the llm and assert result
    await llm("prompt")
    assert requester.num_rewrites == 0


async def test_loose_mode_receiver_handles_valid_json():
    expected_raw_json = {"integer": 1, "string": "value"}
    raw_json_str = json.dumps(expected_raw_json)
    recovery = AsyncMock(raises=ValueError)
    llm = TestLLM(
        json_handler=JsonHandler(None, TestReceiver(recovery)),
        output=LLMOutput(output=TestOutput(content=raw_json_str)),
    )

    # call the llm and assert result
    response = await llm("prompt", json=True)

    assert response.output.content == raw_json_str
    assert response.raw_json == expected_raw_json
    assert response.parsed_json is None


async def test_loose_mode_receiver_handles_valid_json_default_handler():
    bad_json = '{"x": 1'
    llm = TestLLM(
        json_handler=JsonHandler(None, TestReceiver()),
        output=LLMOutput(output=TestOutput(content=bad_json)),
    )

    # call the llm and assert result
    with pytest.raises(FailedToGenerateValidJsonError):
        await llm("prompt", json=True)


async def test_loose_mode_receiver_read_model():
    class Model(BaseModel):
        integer: int
        string: str

    expected_raw_json = {"integer": 1, "string": "value"}
    raw_json_str = json.dumps(expected_raw_json)
    recovery = AsyncMock(raises=ValueError)
    llm = TestLLM(
        json_handler=JsonHandler(None, TestReceiver(recovery)),
        output=LLMOutput(output=TestOutput(content=raw_json_str)),
    )

    # call the llm and assert result
    response = await llm("prompt", json_model=Model)

    assert response.output.content == raw_json_str
    assert response.raw_json == expected_raw_json
    model: Model = cast(Model, response.parsed_json)
    assert model.integer == 1
    assert model.string == "value"


async def test_loose_mode_receiver_read_model_invalid():
    class Model(BaseModel):
        integer: int
        string: str

    expected_raw_json = {"integerxxx": 1, "string": "value"}
    raw_json_str = json.dumps(expected_raw_json)
    recovery = AsyncMock(return_value=(None, None, None))
    llm = TestLLM(
        json_handler=JsonHandler(None, TestReceiver(recovery)),
        output=LLMOutput(output=TestOutput(content=raw_json_str)),
    )

    # call the llm and assert result
    with pytest.raises(FailedToGenerateValidJsonError):
        await llm("prompt", json_model=Model)


async def test_loose_mode_recovers():
    bad_json = '{"x": 1'
    expected_raw_json = {"integer": 1, "string": "value"}
    raw_json_str = json.dumps(expected_raw_json)
    recovery = AsyncMock(return_value=(raw_json_str, expected_raw_json, None))
    llm = TestLLM(
        json_handler=JsonHandler(None, TestReceiver(recovery)),
        output=LLMOutput(output=TestOutput(content=bad_json)),
    )

    # call the llm and assert result
    response = await llm("prompt", json=True)

    assert response.output.content == raw_json_str
    assert response.raw_json == expected_raw_json
    assert response.parsed_json is None


async def test_loose_mode_fails():
    bad_json = '{"x": 1'
    recovery = AsyncMock(return_value=(None, None, None))
    llm = TestLLM(
        json_handler=JsonHandler(None, TestReceiver(recovery)),
        output=LLMOutput(
            output=TestOutput(
                content=bad_json,
            )
        ),
    )

    # call the llm and assert result
    with pytest.raises(FailedToGenerateValidJsonError):
        await llm("prompt", json=True)


async def test_standard_mode_fails():
    bad_json = '{"x": 1'
    llm = TestLLM(
        json_handler=JsonHandler(None, JsonReceiver(TestMarshaler())),
        output=LLMOutput(
            output=TestOutput(
                content=bad_json,
            )
        ),
    )

    # call the llm and assert result
    with pytest.raises(FailedToGenerateValidJsonError):
        await llm("prompt", json=True)


async def test_standard_mode_receiver_read_model():
    class Model(BaseModel):
        integer: int
        string: str

    expected_raw_json = {"integer": 1, "string": "value"}
    raw_json_str = json.dumps(expected_raw_json)
    llm = TestLLM(
        json_handler=JsonHandler(None, JsonReceiver(TestMarshaler())),
        output=LLMOutput(output=TestOutput(content=raw_json_str)),
    )

    # call the llm and assert result
    response = await llm("prompt", json_model=Model)

    assert response.output.content == raw_json_str
    assert response.raw_json == expected_raw_json
    model: Model = cast(Model, response.parsed_json)
    assert model.integer == 1
    assert model.string == "value"


async def test_standard_mode_receiver_read_model_invalid():
    class Model(BaseModel):
        integer: int
        string: str

    expected_raw_json = {"integerxxx": 1, "string": "value"}
    raw_json_str = json.dumps(expected_raw_json)
    llm = TestLLM(
        json_handler=JsonHandler(None, JsonReceiver(TestMarshaler())),
        output=LLMOutput(output=TestOutput(content=raw_json_str)),
    )

    # call the llm and assert result
    with pytest.raises(FailedToGenerateValidJsonError):
        await llm("prompt", json_model=Model)
