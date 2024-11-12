from unittest.mock import Mock

from fnllm.openai.llm.chat_text import OpenAITextChatLLMImpl
from fnllm.services.cache_interactor import CacheInteractor


def test_child_with_cache():
    llm = OpenAITextChatLLMImpl(client=Mock(), cache=CacheInteractor(), model="model")
    child = llm.child("test")
    assert llm is not child
