# Copyright (c) 2024 Microsoft Corporation.
"""The TextService."""

from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    import tiktoken


@dataclass
class TextChunk:
    """A chunk of text."""

    text: str
    num_tokens: int


class InvalidMaxLengthError(ValueError):
    """An error raised when the text length is invalid."""


class OpenAITextService:
    """Service for handling text encoding and decoding."""

    def __init__(self, encoding: tiktoken.Encoding) -> None:
        self._encoding = encoding

    @property
    def encoding(self) -> tiktoken.Encoding:
        """Get the encoding."""
        return self._encoding

    def count_tokens(self, text: str) -> int:
        """Measure the number of tokens in a text."""
        return len(self.encode(text))

    def trim_to_max_tokens(self, text: str, max_length: int) -> str:
        """Trim the text to the given number of tokens."""
        if max_length <= 0:
            raise InvalidMaxLengthError
        tokens = self.encode(text)
        if len(tokens) > max_length:
            tokens = tokens[:max_length]
        return self.decode(tokens)

    def encode(self, text: str) -> list[int]:
        """Encode the text into tokens."""
        return self.encoding.encode(text)

    def decode(self, tokens: list[int]) -> str:
        """Decode the tokens into text."""
        return self.encoding.decode(tokens)

    def split(self, text: str, max_length: int) -> list[TextChunk]:
        """Split the text into chunks of the given length."""
        if max_length <= 0:
            raise InvalidMaxLengthError
        tokens = self.encode(text)
        chunks = []
        while tokens:
            chunk = tokens[:max_length]
            tokens = tokens[max_length:]
            chunks.append(TextChunk(text=self.decode(chunk), num_tokens=len(chunk)))
        return chunks
