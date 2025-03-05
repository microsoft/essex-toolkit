# Copyright 2024 Microsoft Corporation.

"""Tests for openai.llm.chat."""

from typing import TYPE_CHECKING
from unittest.mock import ANY, Mock

from fnllm.caching.file import FileCache
from fnllm.events.base import LLMEvents
from fnllm.openai.config import AzureOpenAIConfig
from fnllm.openai.factories.chat import create_openai_chat_llm
from fnllm.openai.roles import OpenAIChatRole
from fnllm.openai.types.aliases import (
    OpenAIChatCompletionMessageModel,
    OpenAICompletionUsageModel,
)
from fnllm.openai.types.chat.io import OpenAIChatOutput

from fnllm_tests.unit.openai.llm.conftest import (
    OpenAIChatCompletionClientMock,
    mock_chat_completion_model,
)

if TYPE_CHECKING:
    from fnllm.openai.types import OpenAIChatLLM


def test_open_ai_chat_output_str():
    output = OpenAIChatOutput(
        raw_input=None,
        raw_output=OpenAIChatCompletionMessageModel(
            content="some content",
            role="assistant",
        ),
        raw_model=mock_chat_completion_model(),
        content="some content",
        usage=None,
    )
    assert str(output) == "some content"


async def test_chat_llm_with_global_model_config(
    chat_completion_client_mock: OpenAIChatCompletionClientMock,
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
        client=chat_completion_client_mock.mock_response(
            message=OpenAIChatCompletionMessageModel(
                content="Hello! How can I help?", role="assistant"
            ),
            usage=OpenAICompletionUsageModel(
                completion_tokens=10, prompt_tokens=20, total_tokens=30
            ),
            model=config.model,
        ),
    )

    # call llm
    input_prompt = "Hello! $user"
    response = await llm(input_prompt, variables={"user": "User One"})

    # check the expected output
    expected_output = chat_completion_client_mock.expected_output_for_prompt(
        "Hello! User One"
    )
    assert response.output == expected_output

    # check the parameters have properly propagated to the client call
    chat_completion_client_mock.response_mock.assert_called_once_with(
        messages=[expected_output.raw_input],
        model=config.model,
        temperature=0.5,
        seed=321,
    )


async def test_chat_llm_json_request(
    chat_completion_client_mock: OpenAIChatCompletionClientMock,
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
        client=chat_completion_client_mock.mock_response(
            message=OpenAIChatCompletionMessageModel(
                content='{"test": "hello"}', role="assistant"
            ),
            usage=OpenAICompletionUsageModel(
                completion_tokens=10, prompt_tokens=20, total_tokens=30
            ),
            model=config.model,
        ),
    )

    # call llm
    input_prompt = "Hello! $user"
    response = await llm(input_prompt, variables={"user": "User One"}, json=True)

    # check the expected output
    assert response.raw_json == {"test": "hello"}


async def test_chat_llm_with_global_model_config_overwrite(
    chat_completion_client_mock: OpenAIChatCompletionClientMock,
):
    config = AzureOpenAIConfig(
        api_version="api_version",
        endpoint="endpoint",
        model="my_model",
        chat_parameters={"temperature": 0.5, "seed": 321},
    )

    # create llm instance with mocked client
    llm: OpenAIChatLLM = create_openai_chat_llm(
        config=config,
        client=chat_completion_client_mock.mock_response(
            message=OpenAIChatCompletionMessageModel(
                content="Hello! How can I help?", role="assistant"
            ),
            usage=OpenAICompletionUsageModel(
                completion_tokens=10, prompt_tokens=20, total_tokens=30
            ),
            model=config.model,
        ),
    )
    child = llm.child("test")
    assert child is not None

    # call llm
    input_prompt = None  # also test None prompt
    response = await llm(
        input_prompt, model_parameters={"model": "other_model", "seed": 987}
    )

    # check the expected output
    expected_output = chat_completion_client_mock.expected_output_for_prompt(
        input_prompt
    )
    assert response.output == expected_output

    # check the parameters have properly propagated to the client call
    chat_completion_client_mock.response_mock.assert_called_once_with(
        messages=[],
        model="other_model",
        temperature=0.5,
        seed=987,
    )


async def test_chat_llm_with_cache(
    chat_completion_client_mock: OpenAIChatCompletionClientMock, file_cache: FileCache
):
    config = AzureOpenAIConfig(
        api_version="api_version",
        endpoint="endpoint",
        model="my_model",
    )
    mocked_events = Mock(LLMEvents)

    # create llm instance with mocked client
    llm = create_openai_chat_llm(
        config=config,
        client=chat_completion_client_mock.mock_response(
            message=OpenAIChatCompletionMessageModel(
                content="Hello! How can I help?", role="assistant"
            ),
            usage=OpenAICompletionUsageModel(
                completion_tokens=10, prompt_tokens=20, total_tokens=30
            ),
            model=config.model,
        ),
        cache=file_cache,
        events=mocked_events,
    )
    # Can create child LLM
    child = llm.child("test_subdir")
    assert child is not llm

    # call llm
    input_prompt = "Hello!"
    name = "cache_test"
    history = [OpenAIChatRole.System.message("Some system message.")]

    # check initial cache miss
    response = await llm(input_prompt, history=history, name=name)
    expected_output = chat_completion_client_mock.expected_output_for_prompt(
        input_prompt
    )
    assert response.output == expected_output
    mocked_events.on_cache_miss.assert_called_once_with(ANY, name)

    # calling again should be a cache hit
    mocked_events.reset_mock()
    response = await llm(input_prompt, history=history, name=name)
    expected_output = chat_completion_client_mock.expected_output_for_prompt(
        input_prompt
    )
    mocked_events.on_cache_hit.assert_called_once_with(ANY, name)

    # after changing the prompt should be a cache miss
    mocked_events.reset_mock()
    response = await llm(
        "Other prompt",
        history=history,
        name=name,
    )
    expected_output = chat_completion_client_mock.expected_output_for_prompt(
        "Other prompt"
    )
    mocked_events.on_cache_miss.assert_called_once_with(ANY, name)

    # after changing the history should be a cache miss
    mocked_events.reset_mock()
    response = await llm(
        input_prompt,
        history=[OpenAIChatRole.System.message("Some system message 2.")],
        name=name,
    )
    expected_output = chat_completion_client_mock.expected_output_for_prompt(
        input_prompt
    )
    mocked_events.on_cache_miss.assert_called_once_with(ANY, name)


async def test_chat_on_post_limit_event(
    chat_completion_client_mock: OpenAIChatCompletionClientMock,
):
    config = AzureOpenAIConfig(
        api_version="api_version",
        endpoint="endpoint",
        model="my_model",
        tokens_per_minute=100,
    )
    mocked_events = Mock(LLMEvents)

    # create llm instance with mocked client
    llm = create_openai_chat_llm(
        config=config,
        client=chat_completion_client_mock.mock_response(
            message=OpenAIChatCompletionMessageModel(
                content="Hello! How can I help?", role="assistant"
            ),
            usage=OpenAICompletionUsageModel(
                completion_tokens=1000, prompt_tokens=200, total_tokens=1200
            ),
            model=config.model,
        ),
        events=mocked_events,
    )

    # call llm
    await llm("Hello!")

    # check event is triggered
    mocked_events.on_post_limit.assert_called_once()


async def test_chat_on_success_event(
    chat_completion_client_mock: OpenAIChatCompletionClientMock,
):
    config = AzureOpenAIConfig(
        api_version="api_version",
        endpoint="endpoint",
        model="my_model",
    )
    mocked_events = Mock(LLMEvents)

    # create llm instance with mocked client
    llm = create_openai_chat_llm(
        config=config,
        client=chat_completion_client_mock.mock_response(
            message=OpenAIChatCompletionMessageModel(
                content="Hello! How can I help?", role="assistant"
            ),
            usage=OpenAICompletionUsageModel(
                completion_tokens=0, prompt_tokens=0, total_tokens=0
            ),
            model=config.model,
        ),
        events=mocked_events,
    )

    # call llm
    await llm("Hello!")

    # should not be triggered since there are no usage tokens
    mocked_events.on_post_limit.assert_not_called()

    # should be called once at the end
    mocked_events.on_success.assert_called_once()


def test_is_reasoning_model(
    chat_completion_client_mock: OpenAIChatCompletionClientMock,
):
    config = AzureOpenAIConfig(
        api_version="api_version",
        endpoint="endpoint",
        model="o3-mini",
        chat_parameters={"temperature": 0.5, "seed": 321},
    )

    # create llm instance with mocked client
    llm = create_openai_chat_llm(
        config=config,
        client=chat_completion_client_mock.mock_response(
            message=OpenAIChatCompletionMessageModel(
                content="Hello! How can I help?", role="assistant"
            ),
            usage=OpenAICompletionUsageModel(
                completion_tokens=10, prompt_tokens=20, total_tokens=30
            ),
            model=config.model,
        ),
    )

    assert llm.is_reasoning_model()


def test_is_not_reasoning_model(
    chat_completion_client_mock: OpenAIChatCompletionClientMock,
):
    config = AzureOpenAIConfig(
        api_version="api_version",
        endpoint="endpoint",
        model="model",
        chat_parameters={"temperature": 0.5, "seed": 321},
    )

    # create llm instance with mocked client
    llm = create_openai_chat_llm(
        config=config,
        client=chat_completion_client_mock.mock_response(
            message=OpenAIChatCompletionMessageModel(
                content="Hello! How can I help?", role="assistant"
            ),
            usage=OpenAICompletionUsageModel(
                completion_tokens=10, prompt_tokens=20, total_tokens=30
            ),
            model=config.model,
        ),
    )

    assert not llm.is_reasoning_model()
