# Copyright (c) 2024 Microsoft Corporation.

"""Base protocol for decorator services."""

import json
from abc import ABC, abstractmethod
from collections.abc import Awaitable, Callable
from typing import Generic, cast

import pydantic
from json_repair import repair_json
from typing_extensions import Unpack

from fnllm.services.errors import FailedToGenerateValidJsonError
from fnllm.types.generics import (
    JSON,
    THistoryEntry,
    TInput,
    TJsonModel,
    TModelParameters,
    TOutput,
)
from fnllm.types.io import LLMInput, LLMOutput

from .decorator import LLMDecorator


class JsonHandler(Generic[TOutput, THistoryEntry]):
    """A json-handling strategy."""

    def __init__(
        self,
        requester: LLMDecorator[TOutput, THistoryEntry] | None = None,
        receiver: LLMDecorator[TOutput, THistoryEntry] | None = None,
    ):
        """Create a new JsonHandler."""
        self._requester = requester
        self._receiver = receiver

    @property
    def requester(self) -> LLMDecorator[TOutput, THistoryEntry] | None:
        """The inner decorator."""
        return self._requester

    @property
    def receiver(self) -> LLMDecorator[TOutput, THistoryEntry] | None:
        """The inner decorator."""
        return self._receiver


class BaseJsonDecorator(
    ABC, LLMDecorator[TOutput, THistoryEntry], Generic[TInput, TOutput, THistoryEntry]
):
    """An OpenAI JSON parsing LLM."""

    def decorate(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
    ) -> Callable[..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]]:
        """Decorate the delegate with the JSON functionality."""
        this = self

        async def invoke(
            prompt: TInput,
            **kwargs: Unpack[LLMInput[TJsonModel, THistoryEntry, TModelParameters]],
        ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
            if kwargs.get("json_model") is not None or kwargs.get("json"):
                return await this.invoke_json(delegate, prompt, kwargs)
            return await delegate(prompt, **kwargs)

        return invoke

    @abstractmethod
    async def invoke_json(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
        prompt: TInput,
        kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters],
    ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
        """Invoke the JSON decorator."""


class JsonMarshaler(ABC, Generic[TOutput, THistoryEntry]):
    """Marshal JSON data into and out of output payloads."""

    @abstractmethod
    def inject_json_string(
        self,
        json_string: str | None,
        output: LLMOutput[TOutput, TJsonModel, THistoryEntry],
    ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
        """Inject the JSON string into the output."""

    @abstractmethod
    def extract_json_string(
        self, output: LLMOutput[TOutput, TJsonModel, THistoryEntry]
    ) -> str | None:
        """Extract the JSON string from the output."""


class JsonRequester(
    BaseJsonDecorator[TInput, TOutput, THistoryEntry],
    Generic[TInput, TOutput, THistoryEntry, TModelParameters],
):
    """A decorator for handling JSON output. This implementation should be the outer decorator."""

    @abstractmethod
    def rewrite_args(
        self,
        prompt: TInput,
        kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters],
    ) -> tuple[TInput, LLMInput[TJsonModel, THistoryEntry, TModelParameters]]:
        """Rewrite the input prompt and arguments.."""

    async def invoke_json(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
        prompt: TInput,
        kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters],
    ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
        """Invoke the JSON decorator."""
        prompt, kwargs = self.rewrite_args(prompt, kwargs)
        return await delegate(prompt, **kwargs)


class JsonReceiver(
    BaseJsonDecorator[TInput, TOutput, THistoryEntry],
    Generic[TInput, TOutput, THistoryEntry, TModelParameters],
):
    """A decorator for handling JSON output. This implementation should be the outer decorator."""

    def __init__(
        self,
        marshaler: JsonMarshaler[TOutput, THistoryEntry],
        max_retries: int,
    ):
        """Create a new JsonReceiver."""
        self._marshaler = marshaler
        self._max_retries = max_retries

    async def invoke_json(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
        prompt: TInput,
        kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters],
    ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
        """Invoke the JSON decorator."""
        error: FailedToGenerateValidJsonError | None = None
        name = kwargs.get("name", "")
        for attempt in range(self._max_retries + 1):
            try:
                if attempt > 0:
                    kwargs["name"] = f"{name}-(retry {attempt})"
                return await self.try_receive_json(delegate, prompt, kwargs)
            except FailedToGenerateValidJsonError as e:
                error = e

        raise FailedToGenerateValidJsonError from error

    async def try_receive_json(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
        prompt: TInput,
        kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters],
    ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
        """Invoke the JSON decorator."""
        json_model = kwargs.get("json_model")
        result = await delegate(prompt, **kwargs)
        json_string = self._marshaler.extract_json_string(result)
        raw_json = self._parse_json_string(json_string)
        model = self._read_model_from_json(raw_json, json_model)
        self._marshaler.inject_json_string(json_string, result)
        result.raw_json = raw_json
        result.parsed_json = model
        return result

    def _parse_json_string(
        self,
        value: str | None,
    ) -> JSON | None:
        try:
            return json.loads(value) if value else None
        except json.JSONDecodeError as err:
            msg = f"JSON response is not a valid JSON, response={value}."
            raise FailedToGenerateValidJsonError(msg) from err

    def _read_model_from_json(
        self,
        value: JSON | None,
        json_model: type[TJsonModel] | None,
    ) -> TJsonModel | None:
        if value is None or json_model is None:
            return None
        try:
            return json_model.model_validate(value)
        except pydantic.ValidationError as err:
            msg = f"JSON response does not match the expected model, response={value}."
            raise FailedToGenerateValidJsonError(msg) from err


class LooseModeJsonReceiver(
    JsonReceiver[TInput, TOutput, THistoryEntry, TModelParameters],
    Generic[TInput, TOutput, THistoryEntry, TModelParameters],
):
    """A decorator for handling JSON output. This implementation should be the outer decorator."""

    async def try_receive_json(
        self,
        delegate: Callable[
            ..., Awaitable[LLMOutput[TOutput, TJsonModel, THistoryEntry]]
        ],
        prompt: TInput,
        kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters],
    ) -> LLMOutput[TOutput, TJsonModel, THistoryEntry]:
        """Invoke the JSON decorator."""
        json_model = kwargs.get("json_model")

        result = await delegate(prompt, **kwargs)
        json_string = self._marshaler.extract_json_string(result)
        try:
            raw_json = self._parse_json_string(json_string)
            model = self._read_model_from_json(raw_json, json_model)
        except FailedToGenerateValidJsonError as err:
            # A 'None' value would not have thrown an error
            json_string = cast(str, json_string)
            try:
                (
                    json_string,
                    raw_json,
                    model,
                ) = await self._try_recovering_malformed_json(
                    err, json_string, prompt, kwargs
                )
                if raw_json is not None:
                    self._marshaler.inject_json_string(json_string, result)
                    result.raw_json = raw_json
                    result.parsed_json = model
                    return result

                # The recovery didn't work, raise the error
                raise
            except BaseException:  # noqa BLE001
                # The recovery didn't work, raise the error
                raise FailedToGenerateValidJsonError from err
        else:
            self._marshaler.inject_json_string(json_string, result)
            result.raw_json = raw_json
            result.parsed_json = model
            return result

    def _parse_json_string(
        self,
        value: str | None,
    ) -> JSON | None:
        try:
            return json.loads(value) if value else None
        except json.JSONDecodeError as err:
            msg = f"JSON response is not a valid JSON, response={value}."
            raise FailedToGenerateValidJsonError(msg) from err

    def _read_model_from_json(
        self,
        value: JSON | None,
        json_model: type[TJsonModel] | None,
    ) -> TJsonModel | None:
        if value is None or json_model is None:
            return None
        try:
            return json_model.model_validate(value)
        except pydantic.ValidationError as err:
            msg = f"JSON response does not match the expected model, response={value}."
            raise FailedToGenerateValidJsonError(msg) from err

    async def _try_recovering_malformed_json(
        self,
        err: FailedToGenerateValidJsonError,
        json_string: str,
        prompt: TInput,
        kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters],
    ) -> tuple[str | None, JSON | None, TJsonModel | None]:
        """Try to recover from a bad JSON error. Null JSON = unable to recover."""
        json_string = cast(str, repair_json(json_string, skip_json_loads=True))
        json_object = cast(JSON, json.loads(json_string)) if json_string else None
        json_model = kwargs.get("json_model")
        model_instance = json_model.model_validate(json_object) if json_model else None
        return (json_string, json_object, model_instance)
