# Copyright (c) 2024 Microsoft Corporation.

"""Tests for openai.llm.features.json_parsing."""

import json
from typing import Any, cast
from unittest.mock import AsyncMock

import pytest
from fnllm.base.base_llm import BaseLLM
from fnllm.base.services.errors import FailedToGenerateValidJsonError
from fnllm.base.services.json import (
    JsonMarshaler,
    JsonReceiver,
    LooseModeJsonReceiver,
)
from fnllm.types.io import LLMInput, LLMOutput
from pydantic import BaseModel


class TestOutput(BaseModel):
    """OpenAI chat completion output."""

    content: str | None


class TestLLM(BaseLLM):
    def __init__(
        self,
        output: Any,
        json_handler: JsonReceiver | None = None,
        on_execute: AsyncMock | None = None,
    ):
        super().__init__(json_receiver=json_handler)
        self._output = output
        self._on_execute = on_execute or AsyncMock()

    @property
    def inner(self) -> AsyncMock:
        return self._on_execute

    async def _decorator_target(self, prompt: Any, **kwargs: Any) -> Any:
        return self._output

    def _execute_llm(self, prompt: Any, kwargs: Any) -> Any:
        self._on_execute(prompt, **kwargs)

    def is_reasoning_model(self) -> bool:
        return False


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

    def __init__(self, recovery=None, max_retries=3):
        super().__init__(TestMarshaler(), max_retries)
        self._recovery = recovery

    async def _try_recovering_malformed_json(
        self,
        err: FailedToGenerateValidJsonError,
        json_string: str,
        prompt: Any,
        kwargs: Any,
    ) -> tuple[str | None, Any | None, Any | None]:
        """Try to recover from a bad JSON error. Null JSON = unable to recover."""
        if self._recovery is not None:
            return await self._recovery(err, json_string, prompt, kwargs)
        return await super()._try_recovering_malformed_json(
            err, json_string, prompt, kwargs
        )


class CustomModel(BaseModel):
    integer: int
    string: str


async def test_loose_mode_receiver_handles_valid_json():
    expected_raw_json = {"integer": 1, "string": "value"}
    raw_json_str = json.dumps(expected_raw_json)
    recovery = AsyncMock(raises=ValueError)
    llm = TestLLM(
        json_handler=TestReceiver(recovery),
        output=LLMOutput(output=TestOutput(content=raw_json_str)),
    )

    # call the llm and assert result
    response = await llm("prompt", json=True)

    assert response.output.content == raw_json_str
    assert response.raw_json == expected_raw_json
    assert response.parsed_json is None


async def test_loose_mode_receiver_handles_valid_json_default_handler():
    class CustomModel(BaseModel):
        integer: int
        string: str

    bad_json = '{"x": 1'
    llm = TestLLM(
        json_handler=TestReceiver(),
        output=LLMOutput(output=TestOutput(content=bad_json)),
    )

    # call the llm and assert result
    with pytest.raises(FailedToGenerateValidJsonError):
        await llm("prompt", json=True, json_model=CustomModel)


async def test_loose_mode_receiver_can_parse_incomplete_json():
    bad_json = '{"x": 1'
    llm = TestLLM(
        json_handler=TestReceiver(),
        output=LLMOutput(output=TestOutput(content=bad_json)),
    )

    # call the llm and assert result
    result = await llm("prompt", json=True)
    assert result.raw_json == {"x": 1}


async def test_loose_mode_receiver_can_parse_json_with_markdown_headers():
    bad_json = '```json\n{"x": 1}```'
    llm = TestLLM(
        json_handler=TestReceiver(),
        output=LLMOutput(output=TestOutput(content=bad_json)),
    )

    # call the llm and assert result
    result = await llm("prompt", json=True)
    assert result.raw_json == {"x": 1}


async def test_loose_mode_receiver_read_model():
    class Model(BaseModel):
        integer: int
        string: str

    expected_raw_json = {"integer": 1, "string": "value"}
    raw_json_str = json.dumps(expected_raw_json)
    recovery = AsyncMock(raises=ValueError)
    llm = TestLLM(
        json_handler=TestReceiver(recovery),
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
        json_handler=TestReceiver(recovery),
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
        json_handler=TestReceiver(recovery),
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
        json_handler=TestReceiver(recovery),
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
        json_handler=JsonReceiver(TestMarshaler(), 0),
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
        json_handler=JsonReceiver(TestMarshaler(), 0),
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
        json_handler=JsonReceiver(TestMarshaler(), 0),
        output=LLMOutput(output=TestOutput(content=raw_json_str)),
    )

    # call the llm and assert result
    with pytest.raises(FailedToGenerateValidJsonError):
        await llm("prompt", json_model=Model)


async def test_json_receiver_retry_loop():
    receiver = JsonReceiver(TestMarshaler(), 3)
    delegate = AsyncMock()
    delegate.side_effect = [
        # Invalid JSON
        LLMOutput(output=TestOutput(content='{"x": 1"')),
        LLMOutput(output=TestOutput(content='{"x": 2"')),
        # Valid JSON
        LLMOutput(output=TestOutput(content='{"x": 3}')),
    ]
    result = await receiver.invoke_json(
        delegate=delegate, prompt="prompt", kwargs=LLMInput()
    )
    assert result.raw_json == {"x": 3}
