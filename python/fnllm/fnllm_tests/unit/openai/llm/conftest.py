# Copyright (c) 2025 Microsoft Corporation.

"""Utility to mock chat completion client responses."""

from collections.abc import AsyncIterator
from unittest.mock import AsyncMock, Mock

import pytest
from fnllm.openai.types.aliases import (
    OpenAIChatCompletionMessageModel,
    OpenAIChatCompletionModel,
    OpenAIChatCompletionUserMessageParam,
    OpenAIChoiceModel,
    OpenAICompletionUsageModel,
    OpenAICreateEmbeddingResponseModel,
    OpenAIEmbeddingModel,
    OpenAIEmbeddingUsageModel,
)
from fnllm.openai.types.chat.io import OpenAIChatOutput
from fnllm.openai.types.embeddings.io import (
    OpenAIEmbeddingsInput,
    OpenAIEmbeddingsOutput,
)
from fnllm.types.metrics import LLMUsageMetrics
from httpx import Headers
from openai import AsyncStream
from openai.types.chat import ChatCompletionChunk
from openai.types.chat.chat_completion_chunk import Choice as ChunkChoice
from openai.types.chat.chat_completion_chunk import ChoiceDelta as ChunkChoiceDelta


def mock_chat_completion_model():
    return OpenAIChatCompletionModel(
        choices=[], id="1", created=0, model="abc", object="chat.completion"
    )


class MockAsyncStream(AsyncStream):
    """A streaming llm response iterator."""

    def __init__(
        self,
        chunks: list[ChatCompletionChunk | BaseException],
        usage_chunk: ChatCompletionChunk,
    ):
        """Create a new Response."""
        self._chunks = chunks
        self._iterator = self.__stream__()
        self._usage_chunk = usage_chunk
        self._closed = False

    @property
    def messages(self) -> list[str | None]:
        """Return the messages."""
        return [
            chunk.choices[0].delta.content
            for chunk in self._chunks
            if not isinstance(chunk, BaseException)
        ]

    async def __aiter__(self) -> AsyncIterator[ChatCompletionChunk]:
        """Return the iterator."""
        async for item in self._iterator:
            if not self._closed:
                yield item

    async def __stream__(self) -> AsyncIterator[ChatCompletionChunk]:
        """Read chunks from the stream."""
        for chunk in self._chunks:
            if not self._closed:
                if isinstance(chunk, BaseException):
                    raise chunk
                yield chunk

        if not self._closed:
            yield self._usage_chunk

    async def close(self) -> None:
        """Close the stream."""
        self._closed = True


class OpenAIChatCompletionClientMock:
    def __init__(
        self,
    ) -> None:
        self._raw_mock = AsyncMock()
        self._response_mock = AsyncMock()
        self._raw_response: OpenAIChatCompletionModel | None = None

    @property
    def response_mock(self) -> AsyncMock:
        return self._response_mock

    @property
    def expected_response(self) -> OpenAIChatCompletionModel:
        if not self._raw_response:
            msg = "Raw response not set call mock_response first."
            raise RuntimeError(msg)
        return self._raw_response

    @property
    def expected_message(self) -> OpenAIChatCompletionMessageModel:
        return self.expected_response.choices[0].message

    @property
    def expected_usage(self) -> LLMUsageMetrics | None:
        usage = self.expected_response.usage

        if not usage:
            return None

        return LLMUsageMetrics(
            input_tokens=usage.prompt_tokens,
            output_tokens=usage.completion_tokens,
        )

    def expected_output_for_prompt(self, prompt: str | None) -> OpenAIChatOutput:
        if self._raw_response is None:
            raise ValueError
        message = (
            OpenAIChatCompletionUserMessageParam(content=prompt, role="user")
            if prompt
            else None
        )
        return OpenAIChatOutput(
            raw_input=message,
            raw_model=self._raw_response,
            raw_output=self.expected_message,
            content=self.expected_message.content,
            usage=self.expected_usage,
        )

    def mock_response(
        self,
        message: OpenAIChatCompletionMessageModel,
        *,
        completion_id: str = "mocked_id",
        created: int = 0,
        model: str = "mocked_model",
        usage: OpenAICompletionUsageModel | None = None,
    ) -> AsyncMock:
        self._raw_response = OpenAIChatCompletionModel(
            id=completion_id,
            choices=[
                OpenAIChoiceModel(
                    finish_reason="stop",
                    index=0,
                    message=message,
                )
            ],
            created=created,
            model=model,
            object="chat.completion",
            usage=usage,
        )

        response = Mock()
        response.parse = Mock(return_value=self._raw_response)
        response.headers = Headers()
        self._response_mock = AsyncMock(return_value=response)
        self._raw_mock.chat.completions.with_raw_response.create = self._response_mock

        return self._raw_mock


class OpenAIChatCompletionStreamingClientMock:
    def __init__(
        self,
    ) -> None:
        self._raw_mock = AsyncMock()
        self._response_mock = AsyncMock()
        self._raw_response: MockAsyncStream | None = None

    @property
    def response_mock(self) -> MockAsyncStream:
        return self._response_mock

    @property
    def expected_response(self) -> MockAsyncStream:
        if not self._raw_response:
            msg = "Raw response not set call mock_response first."
            raise RuntimeError(msg)
        return self._raw_response

    @property
    def expected_message(self) -> list[str | None]:
        return self.expected_response.messages

    def mock_response(
        self,
        message: list[str | BaseException | None],
        *,
        completion_id: str = "mocked_id",
        created: int = 0,
        model: str = "mocked_model",
        usage: OpenAICompletionUsageModel | None = None,
    ) -> AsyncMock:
        def create_chunk(message: str | None) -> ChatCompletionChunk:
            return ChatCompletionChunk(
                id=completion_id,
                choices=[
                    ChunkChoice(
                        finish_reason="stop",
                        index=0,
                        delta=ChunkChoiceDelta(content=message),
                    )
                ],
                created=created,
                model=model,
                object="chat.completion.chunk",
            )

        response_chunks: list[ChatCompletionChunk | BaseException] = []
        for m in message:
            if isinstance(m, BaseException):
                response_chunks.append(m)
            else:
                response_chunks.append(create_chunk(m))

        usage_chunk = ChatCompletionChunk(
            id=completion_id,
            choices=[],
            created=created,
            model=model,
            usage=usage,
            object="chat.completion.chunk",
        )
        self._raw_response = MockAsyncStream(
            chunks=response_chunks, usage_chunk=usage_chunk
        )

        self._raw_mock.chat.completions.create = self._response_mock = AsyncMock(
            return_value=self._raw_response
        )

        return self._raw_mock


class OpenAIEmbeddingsClientMock:
    def __init__(
        self,
    ) -> None:
        self._raw_mock = AsyncMock()
        self._response_mock = AsyncMock()
        self._raw_response: OpenAICreateEmbeddingResponseModel | None = None

    @property
    def response_mock(self) -> AsyncMock:
        return self._response_mock

    @property
    def expected_response(self) -> OpenAICreateEmbeddingResponseModel:
        if not self._raw_response:
            msg = "Raw response not set call mock_response first."
            raise RuntimeError(msg)
        return self._raw_response

    @property
    def expected_data(self) -> list[OpenAIEmbeddingModel]:
        return self.expected_response.data

    @property
    def expected_usage(self) -> LLMUsageMetrics | None:
        usage = self.expected_response.usage

        if not usage:
            return None

        return LLMUsageMetrics(
            input_tokens=usage.prompt_tokens,
            output_tokens=0,
        )

    def expected_output_for_prompt(
        self, prompt: OpenAIEmbeddingsInput | None
    ) -> OpenAIEmbeddingsOutput:
        if self._raw_response is None:
            raise ValueError
        return OpenAIEmbeddingsOutput(
            raw_input=prompt,
            raw_output=self.expected_data,
            raw_model=self._raw_response,
            embeddings=[d.embedding for d in self.expected_data],
            usage=self.expected_usage,
        )

    def mock_response(
        self,
        data: list[OpenAIEmbeddingModel],
        usage: OpenAIEmbeddingUsageModel,
        *,
        model: str = "mocked_model",
    ) -> AsyncMock:
        self._raw_response = OpenAICreateEmbeddingResponseModel(
            data=data,
            model=model,
            object="list",
            usage=usage,
        )

        response = Mock()
        response.parse = Mock(return_value=self._raw_response)
        response.headers = Headers()
        self._response_mock = AsyncMock(return_value=response)
        self._raw_mock.embeddings.with_raw_response.create = self._response_mock

        return self._raw_mock


@pytest.fixture
def chat_completion_client_mock() -> OpenAIChatCompletionClientMock:
    return OpenAIChatCompletionClientMock()


@pytest.fixture
def chat_completion_streaming_client_mock() -> OpenAIChatCompletionStreamingClientMock:
    return OpenAIChatCompletionStreamingClientMock()


@pytest.fixture
def embeddings_client_mock() -> OpenAIEmbeddingsClientMock:
    return OpenAIEmbeddingsClientMock()
