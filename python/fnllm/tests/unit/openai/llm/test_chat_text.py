from unittest.mock import Mock

from fnllm.base.services.cache_interactor import CacheInteractor
from fnllm.enums import JsonStrategy
from fnllm.events import LLMEvents
from fnllm.openai.llm.openai_text_chat_llm import OpenAITextChatLLMImpl


def test_child_with_cache():
    llm = OpenAITextChatLLMImpl(
        client=Mock(),
        cache=CacheInteractor(events=LLMEvents(), cache=None),
        model="model",
        json_receiver=None,
        json_strategy=JsonStrategy.LOOSE,
    )
    child = llm.child("test")
    assert llm is not child
