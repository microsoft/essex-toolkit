# Copyright (c) 2024 Microsoft Corporation.
"""Unit tests for the OpenAITextService class."""

import tiktoken
from fnllm.openai.services.openai_text_service import OpenAITextService


def test_text_service_encode_decode():
    text_service = OpenAITextService(tiktoken.get_encoding("cl100k_base"))
    text = "Hello, world!"
    tokens = text_service.encode(text)
    assert text_service.decode(tokens) == text


def test_count_tokens():
    text_service = OpenAITextService(tiktoken.get_encoding("cl100k_base"))
    assert text_service.count_tokens("a b c d") == 4
    assert text_service.count_tokens("hello world") == 2


def test_trim_to_max_tokens():
    text_service = OpenAITextService(tiktoken.get_encoding("cl100k_base"))
    assert text_service.trim_to_max_tokens("a b c d", 2) == "a b"
