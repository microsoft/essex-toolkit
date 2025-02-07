from unittest.mock import Mock

from fnllm.enums import JsonStrategy
from fnllm.openai.llm.openai_text_chat_llm import OpenAITextChatLLMImpl


def test_child_with_cache():
    llm = OpenAITextChatLLMImpl(
        client=Mock(),
        cache=None,
        model="model",
        json_receiver=None,
        json_strategy=JsonStrategy.VALID,
    )
    child = llm.child("test")
    assert llm is child

    llm = OpenAITextChatLLMImpl(
        client=Mock(),
        cache=Mock(),
        model="model",
        json_receiver=None,
        json_strategy=JsonStrategy.LOOSE,
    )
    child = llm.child("test")
    assert llm is not child
