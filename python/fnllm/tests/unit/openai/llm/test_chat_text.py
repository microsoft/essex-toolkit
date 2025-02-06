from unittest.mock import Mock

from fnllm.caching.file import FileCache
from fnllm.openai.llm.chat_text import OpenAITextChatLLMImpl


def test_child_with_cache():
    llm = OpenAITextChatLLMImpl(client=Mock(), cache=FileCache(), model="model")
    child = llm.child("test")
    assert llm is not child
