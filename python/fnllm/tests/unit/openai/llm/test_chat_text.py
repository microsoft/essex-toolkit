from unittest.mock import Mock

from fnllm.openai.llm.openai_text_chat_llm import OpenAITextChatLLMImpl


def test_child_with_cache():
    llm = OpenAITextChatLLMImpl(
        client=Mock(),
        cache=None,
        model="model",
        json_receiver=None,
    )
    child = llm.child("test")
    assert llm is not child
