# Copyright (c) 2025 Microsoft Corporation.
from unittest.mock import AsyncMock, Mock

import pytest
from fnllm.base.services.errors import InvalidLLMResultError
from fnllm.enums import JsonStrategy
from fnllm.openai.config import OpenAISpecialTokenBehavior
from fnllm.openai.llm.openai_text_chat_llm import (
    OpenAINoChoicesAvailableError,
    OpenAITextChatLLMImpl,
)
from fnllm.openai.types.aliases import (
    ChatCompletionMessageModel,
    ChatCompletionModel,
    ChoiceModel,
)
from httpx import Headers
from polyfactory.factories.pydantic_factory import ModelFactory


class ChatCompletionModelFactory(ModelFactory[ChatCompletionModel]):
    __model__ = ChatCompletionModel


class ChoiceModelFactory(ModelFactory[ChoiceModel]):
    __model__ = ChoiceModel


class ChatCompletionMessageModelFactory(ModelFactory[ChatCompletionMessageModel]):
    __model__ = ChatCompletionMessageModel


def _mock_delegate() -> tuple[Mock, AsyncMock]:
    delegate = Mock()
    delegate.chat = Mock()
    delegate.chat.completions = Mock()
    delegate.chat.completions.with_raw_response = Mock()
    raw_response = Mock()
    delegate.chat.completions.with_raw_response.create = AsyncMock()
    delegate.chat.completions.with_raw_response.create.return_value = raw_response
    raw_response.parse = Mock(
        return_value=ChatCompletionModelFactory.build(
            choices=[
                ChoiceModelFactory.build(
                    message=ChatCompletionMessageModelFactory.build(content="xxx")
                )
            ]
        )
    )
    raw_response.headers = Headers()
    return delegate, delegate.chat.completions.with_raw_response.create


def test_child_with_cache():
    llm = OpenAITextChatLLMImpl(
        client=Mock(),
        model="model",
        json_strategy=JsonStrategy.VALID,
    )
    child = llm.child("test")
    assert llm is child

    llm = OpenAITextChatLLMImpl(
        client=Mock(),
        cached=Mock(),
        model="model",
        json_strategy=JsonStrategy.LOOSE,
    )
    child = llm.child("test")
    assert llm is not child


def test_is_reasoning_model():
    llm = OpenAITextChatLLMImpl(
        client=Mock(),
        model="o1-mini",
        json_strategy=JsonStrategy.VALID,
    )

    # check reasoning model
    assert llm.is_reasoning_model()


async def test_is_not_reasoning_model():
    llm = OpenAITextChatLLMImpl(
        client=Mock(),
        model="model",
        json_strategy=JsonStrategy.VALID,
    )

    # check reasoning model
    assert not llm.is_reasoning_model()


async def test_special_token_filter_keep():
    delegate, create = _mock_delegate()
    llm = OpenAITextChatLLMImpl(
        client=delegate,
        model="model",
        special_token_behavior=OpenAISpecialTokenBehavior.KEEP,
    )
    await llm("test <|endoftext|> response")
    _, kwargs = create.call_args
    assert kwargs["messages"][0]["content"] == "test <|endoftext|> response"


async def test_special_token_filter_remove():
    delegate, create = _mock_delegate()
    llm = OpenAITextChatLLMImpl(
        client=delegate,
        model="model",
        special_token_behavior=OpenAISpecialTokenBehavior.REMOVE,
    )
    await llm("test <|endoftext|> response")
    _, kwargs = create.call_args
    assert kwargs["messages"][0]["content"] == "test  response"


async def test_special_token_filter_replace():
    delegate, create = _mock_delegate()
    llm = OpenAITextChatLLMImpl(
        client=delegate,
        model="model",
        special_token_behavior=OpenAISpecialTokenBehavior.REPLACE,
    )
    await llm("test <|endoftext|> response")
    _, kwargs = create.call_args
    assert kwargs["messages"][0]["content"] == "test [END_OF_TEXT] response"


async def test_raises_no_choices_available():
    client = Mock()
    client.chat = Mock()
    client.chat.completions = Mock()
    client.chat.completions.with_raw_response = Mock()
    client.chat.completions.with_raw_response.create = AsyncMock()
    response = Mock()
    response.parse = Mock(return_value=ChatCompletionModelFactory.build(choices=[]))
    response.headers = Mock()
    client.chat.completions.with_raw_response.create.return_value = response

    llm = OpenAITextChatLLMImpl(
        client=client,
        model="model",
        json_receiver=None,
        json_strategy=JsonStrategy.VALID,
    )

    # check reasoning model
    with pytest.raises(OpenAINoChoicesAvailableError):
        await llm("test")

    with pytest.raises(InvalidLLMResultError):
        await llm("test")
