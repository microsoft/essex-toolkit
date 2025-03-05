# Copyright (c) 2024 Microsoft Corporation.
"""Unit tests for the OpenAITextService class."""

import pytest
import tiktoken
from fnllm.openai.services.openai_text_service import (
    InvalidMaxLengthError,
    OpenAITextService,
)


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

    with pytest.raises(InvalidMaxLengthError):
        text_service.trim_to_max_tokens("a b c d", 0)


def test_split():
    text_service = OpenAITextService(tiktoken.get_encoding("cl100k_base"))
    text = "a b c d e f g h i j k l m n o p q r s t u v w x y z"
    chunks = text_service.split(text, 5)
    assert len(chunks) == 6
    assert chunks[0].text == "a b c d e"
    assert chunks[1].text == " f g h i j"
    assert chunks[2].text == " k l m n o"
    assert chunks[3].text == " p q r s t"
    assert chunks[4].text == " u v w x y"
    assert chunks[5].text == " z"

    with pytest.raises(InvalidMaxLengthError):
        text_service.split(text, 0)
