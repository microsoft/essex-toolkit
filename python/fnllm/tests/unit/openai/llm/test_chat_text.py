from unittest.mock import Mock

from fnllm.openai.llm.chat_text import OpenAITextChatLLMImpl


def test_child_with_no_cache():
    llm = OpenAITextChatLLMImpl(client=Mock(), cache=None, model="model")
    child = llm.child("test")
    assert llm is child


def test_child_with_cache():
    llm = OpenAITextChatLLMImpl(client=Mock(), cache=Mock(), model="model")
    child = llm.child("test")
    assert llm is not child
