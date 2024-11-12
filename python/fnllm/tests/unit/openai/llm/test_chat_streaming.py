# Copyright 2024 Microsoft Corporation.

"""Tests for openai.llm.chat."""

import pytest
from fnllm.openai.config import AzureOpenAIConfig
from fnllm.openai.factories.chat import create_openai_chat_llm
from fnllm.openai.types.aliases import OpenAICompletionUsageModel

from tests.unit.openai.llm.conftest import OpenAIChatCompletionStreamingClientMock


async def test_streaming_chat_llm(
    chat_completion_streaming_client_mock: OpenAIChatCompletionStreamingClientMock,
):
    config = AzureOpenAIConfig(
        api_version="api_version",
        endpoint="endpoint",
        model="my_model",
        chat_parameters={"temperature": 0.5, "seed": 321},
    )

    # create llm instance with mocked client
    llm = create_openai_chat_llm(
        config=config,
        client=chat_completion_streaming_client_mock.mock_response(
            message=["Hello", ", how can I help?"],
            usage=OpenAICompletionUsageModel(
                completion_tokens=10, prompt_tokens=20, total_tokens=30
            ),
            model=config.model,
        ),
    )
    # Child LLM same as parent, no cache used in streaming LLM
    child = llm.child("test")
    assert llm is not child

    # call llm
    input_prompt = "Hello! $user"
    response = await llm(input_prompt, variables={"user": "User One"}, stream=True)

    result = [chunk async for chunk in response.output.content]
    assert result == ["Hello", ", how can I help?"]


async def test_streaming_chat_llm_with_usage(
    chat_completion_streaming_client_mock: OpenAIChatCompletionStreamingClientMock,
):
    config = AzureOpenAIConfig(
        api_version="api_version",
        endpoint="endpoint",
        model="my_model",
        chat_parameters={"temperature": 0.5, "seed": 321},
        track_stream_usage=True,
    )

    # create llm instance with mocked client
    llm = create_openai_chat_llm(
        config=config,
        client=chat_completion_streaming_client_mock.mock_response(
            message=["Hello", ", how can I help?"],
            usage=OpenAICompletionUsageModel(
                completion_tokens=10, prompt_tokens=20, total_tokens=30
            ),
            model=config.model,
        ),
    )

    # call llm
    input_prompt = "Hello! $user"
    response = await llm(input_prompt, variables={"user": "User One"}, stream=True)

    assert response.output.usage is None
    result = [chunk async for chunk in response.output.content]
    assert response.output.usage is not None
    assert result == ["Hello", ", how can I help?"]


async def test_streaming_chat_llm_with_midstream_error(
    chat_completion_streaming_client_mock: OpenAIChatCompletionStreamingClientMock,
):
    class TestError(ValueError):
        pass

    config = AzureOpenAIConfig(
        api_version="api_version",
        endpoint="endpoint",
        model="my_model",
        chat_parameters={"temperature": 0.5, "seed": 321},
    )

    # create llm instance with mocked client
    llm = create_openai_chat_llm(
        config=config,
        client=chat_completion_streaming_client_mock.mock_response(
            message=["Hello", TestError()],
            usage=OpenAICompletionUsageModel(
                completion_tokens=10, prompt_tokens=20, total_tokens=30
            ),
            model=config.model,
        ),
    )

    # call llm
    input_prompt = "Hello! $user"
    response = await llm(input_prompt, variables={"user": "User One"}, stream=True)

    raw_input = response.output.raw_input
    assert raw_input is not None
    assert raw_input.get("content") == "Hello! User One"

    with pytest.raises(TestError):
        [chunk async for chunk in response.output.content]


async def test_streaming_chat_llm_close(
    chat_completion_streaming_client_mock: OpenAIChatCompletionStreamingClientMock,
):
    class TestError(ValueError):
        pass

    config = AzureOpenAIConfig(
        api_version="api_version",
        endpoint="endpoint",
        model="my_model",
        chat_parameters={"temperature": 0.5, "seed": 321},
    )

    # create llm instance with mocked client
    llm = create_openai_chat_llm(
        config=config,
        client=chat_completion_streaming_client_mock.mock_response(
            message=["Hello", "there", "user", "my", "name", "is", "bot"],
            usage=OpenAICompletionUsageModel(
                completion_tokens=10, prompt_tokens=20, total_tokens=30
            ),
            model=config.model,
        ),
    )

    # call llm
    input_prompt = "Hello! $user"
    response = await llm(input_prompt, variables={"user": "User One"}, stream=True)

    index = 0
    streamed = []
    async for chunk in response.output.content:
        if index == 1:
            await response.output.close()
        index += 1
        streamed.append(chunk)

    assert streamed == ["Hello", "there"]
