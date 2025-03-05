# Copyright 2024 Microsoft Corporation.

"""Tests for openai.llm.embeddings."""

from unittest.mock import ANY, Mock

from fnllm.caching.file import FileCache
from fnllm.events.base import LLMEvents
from fnllm.openai.config import AzureOpenAIConfig
from fnllm.openai.factories.embeddings import create_openai_embeddings_llm
from fnllm.openai.llm.openai_embeddings_llm import OpenAIEmbeddingsLLMImpl
from fnllm.openai.types.aliases import OpenAIEmbeddingModel, OpenAIEmbeddingUsageModel

from fnllm_tests.unit.openai.llm.conftest import OpenAIEmbeddingsClientMock


def test_embedding_llm_child_with_cache():
    llm = OpenAIEmbeddingsLLMImpl(
        client=Mock(),
        model="model",
    )
    child = llm.child("test")
    assert llm is child

    llm = OpenAIEmbeddingsLLMImpl(
        client=Mock(),
        cached=Mock(),
        model="model",
    )
    child = llm.child("test")
    assert llm is not child


async def test_embeddings_llm_with_global_model_config(
    embeddings_client_mock: OpenAIEmbeddingsClientMock,
):
    config = AzureOpenAIConfig(
        api_version="api_version",
        endpoint="endpoint",
        model="my_model",
        embeddings_parameters={"user": "some_user", "dimensions": 3},
    )

    # create llm instance with mocked client
    llm = create_openai_embeddings_llm(
        config=config,
        client=embeddings_client_mock.mock_response(
            data=[
                OpenAIEmbeddingModel(
                    embedding=[0.1, 0.2, 0.3], index=0, object="embedding"
                )
            ],
            usage=OpenAIEmbeddingUsageModel(prompt_tokens=10, total_tokens=10),
            model=config.model,
        ),
    )

    # call llm
    input_prompt = "Hello! $user"
    response = await llm(input_prompt, variables={"user": "User One"})

    # check the expected output
    expected_output = embeddings_client_mock.expected_output_for_prompt(
        "Hello! User One"
    )
    assert response.output == expected_output

    # check the parameters have properly propagated to the client call
    embeddings_client_mock.response_mock.assert_called_once_with(
        input=expected_output.raw_input,
        model=config.model,
        user="some_user",
        dimensions=3,
    )


async def test_embeddings_llm_with_global_model_config_overwrite(
    embeddings_client_mock: OpenAIEmbeddingsClientMock,
):
    config = AzureOpenAIConfig(
        api_version="api_version",
        endpoint="endpoint",
        model="my_model",
        embeddings_parameters={"user": "some_user", "dimensions": 3},
    )

    # create llm instance with mocked client
    llm = create_openai_embeddings_llm(
        config=config,
        client=embeddings_client_mock.mock_response(
            data=[
                OpenAIEmbeddingModel(
                    embedding=[0.1, 0.2, 0.3, 0.4], index=0, object="embedding"
                )
            ],
            usage=OpenAIEmbeddingUsageModel(prompt_tokens=10, total_tokens=10),
            model=config.model,
        ),
    )

    # call llm
    input_prompt = "Hello!"
    response = await llm(
        input_prompt, model_parameters={"model": "other_model", "dimensions": 4}
    )

    # check the expected output
    expected_output = embeddings_client_mock.expected_output_for_prompt(input_prompt)
    assert response.output.embeddings == expected_output.embeddings
    assert response.output.raw_input == expected_output.raw_input
    assert response.output.raw_output == expected_output.raw_output

    # check the parameters have properly propagated to the client call
    embeddings_client_mock.response_mock.assert_called_once_with(
        input=expected_output.raw_input,
        model="other_model",
        user="some_user",
        dimensions=4,
    )


async def test_embeddings_llm_with_cache(
    embeddings_client_mock: OpenAIEmbeddingsClientMock, file_cache: FileCache
):
    config = AzureOpenAIConfig(
        api_version="api_version",
        endpoint="endpoint",
        model="my_model",
        embeddings_parameters={"user": "some_user", "dimensions": 3},
    )
    mocked_events = Mock(LLMEvents)

    # create llm instance with mocked client
    llm = create_openai_embeddings_llm(
        config=config,
        client=embeddings_client_mock.mock_response(
            data=[
                OpenAIEmbeddingModel(
                    embedding=[0.1, 0.2, 0.3], index=0, object="embedding"
                )
            ],
            usage=OpenAIEmbeddingUsageModel(prompt_tokens=10, total_tokens=10),
            model=config.model,
        ),
        cache=file_cache,
        events=mocked_events,
    )

    # call llm
    input_prompt = "Hello!"
    name = "cache_test"

    # check initial cache miss
    response = await llm(input_prompt, name=name)
    expected_output = embeddings_client_mock.expected_output_for_prompt(input_prompt)
    assert response.output.embeddings == expected_output.embeddings
    assert response.output.raw_input == expected_output.raw_input
    assert response.output.raw_output == expected_output.raw_output
    mocked_events.on_cache_miss.assert_called_once_with(ANY, name)

    # calling again should be a cache hit
    mocked_events.reset_mock()
    response = await llm(input_prompt, name=name)
    expected_output = embeddings_client_mock.expected_output_for_prompt(input_prompt)
    mocked_events.on_cache_hit.assert_called_once_with(ANY, name)

    # after changing the prompt should be a cache miss
    mocked_events.reset_mock()
    response = await llm(
        "Other prompt",
        name=name,
    )
    expected_output = embeddings_client_mock.expected_output_for_prompt("Other prompt")
    mocked_events.on_cache_miss.assert_called_once_with(ANY, name)


def test_is_reasoning_model():
    llm = OpenAIEmbeddingsLLMImpl(
        client=Mock(),
        model="O3-MINI",
    )

    assert llm.is_reasoning_model()


def test_is_not_reasoning_model():
    llm = OpenAIEmbeddingsLLMImpl(
        client=Mock(),
        model="other-model",
    )

    assert not llm.is_reasoning_model()
