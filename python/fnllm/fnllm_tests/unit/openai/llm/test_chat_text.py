from unittest.mock import AsyncMock, Mock

import pytest
from fnllm.base.services.errors import InvalidLLMResultError
from fnllm.enums import JsonStrategy
from fnllm.openai.llm.openai_text_chat_llm import (
    OpenAINoChoicesAvailableError,
    OpenAITextChatLLMImpl,
)
from fnllm.openai.types.aliases import ChatCompletionModel
from polyfactory.factories.pydantic_factory import ModelFactory


def test_child_with_cache():
    llm = OpenAITextChatLLMImpl(
        client=Mock(),
        model="model",
        json_receiver=None,
        json_strategy=JsonStrategy.VALID,
    )
    child = llm.child("test")
    assert llm is child

    llm = OpenAITextChatLLMImpl(
        client=Mock(),
        cached=Mock(),
        model="model",
        json_receiver=None,
        json_strategy=JsonStrategy.LOOSE,
    )
    child = llm.child("test")
    assert llm is not child


def test_is_reasoning_model():
    llm = OpenAITextChatLLMImpl(
        client=Mock(),
        model="o1-mini",
        json_receiver=None,
        json_strategy=JsonStrategy.VALID,
    )

    # check reasoning model
    assert llm.is_reasoning_model()


def test_is_not_reasoning_model():
    llm = OpenAITextChatLLMImpl(
        client=Mock(),
        model="model",
        json_receiver=None,
        json_strategy=JsonStrategy.VALID,
    )

    # check reasoning model
    assert not llm.is_reasoning_model()


class ChatCompletionModelFactory(ModelFactory[ChatCompletionModel]):
    __model__ = ChatCompletionModel


async def test_raises_no_choices_available():
    client = Mock()
    client.chat = Mock()
    client.chat.completions = Mock()
    client.chat.completions.create = AsyncMock()
    response = ChatCompletionModelFactory.build(choices=[])
    client.chat.completions.create.return_value = response

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
