# Copyright (c) 2024 Microsoft Corporation.

"""OpenAI embeddings parameters types."""

from typing import Literal

from typing_extensions import NotRequired, TypedDict


class OpenAIEmbeddingsParameters(TypedDict):
    """OpenAI allowed embeddings parameters."""

    model: NotRequired[str]

    dimensions: NotRequired[int]

    encoding_format: NotRequired[Literal["float", "base64"]]

    user: NotRequired[str]

    timeout: NotRequired[float]
