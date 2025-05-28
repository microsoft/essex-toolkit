# Copyright (c) 2025 Microsoft Corporation.
"""Chat LLM Integration Tests."""

import os
import tempfile
from pathlib import Path

from fnllm.base.config import JsonStrategy
from fnllm.caching.file import FileCache
from fnllm.openai import (
    AzureOpenAIConfig,
    create_openai_chat_llm,
)
from pydantic import BaseModel


class ValueModel(BaseModel):
    """Model for a JSON object with a value key."""

    value: int


def _create_config(json_strategy: JsonStrategy) -> AzureOpenAIConfig:
    """Create a configuration for the OpenAI chat LLM."""
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview")
    model = os.getenv("AZURE_OPENAI_MODEL", "gpt-4.1-mini")
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4.1-mini")
    if not endpoint:
        raise ValueError
    return AzureOpenAIConfig(
        endpoint=endpoint,
        api_version=api_version,
        json_strategy=json_strategy,
        model=model,
        deployment=deployment,
    )


async def test_chat_llm() -> None:
    """Test the OpenAI chat LLM creation."""
    config = _create_config(JsonStrategy.VALID)
    cache_path = Path(tempfile.gettempdir()) / "fnllm_cache"
    cache = FileCache(cache_path)

    llm = create_openai_chat_llm(config=config, cache=cache)
    response = await llm("Hello, how are you?")
    assert response is not None
    assert response.output is not None
    assert response.output.content is not None
    assert isinstance(response.output.content, str)


async def test_chat_llm_json_output() -> None:
    """Test raw json mode."""
    config = _create_config(JsonStrategy.VALID)
    cache_path = Path(tempfile.gettempdir()) / "fnllm_cache"
    cache = FileCache(cache_path)

    llm = create_openai_chat_llm(config=config, cache=cache)
    response = await llm(
        "Please emit a json object with a random number in the 'value' key: e.g. {{\"value\": 100}}.",
        json_model=ValueModel,
    )
    assert response is not None
    assert response.output is not None
    assert response.parsed_json is not None
    assert isinstance(response.parsed_json, ValueModel)
    assert isinstance(response.parsed_json.value, int)


async def test_chat_llm_structured_output() -> None:
    """Test structured JSON mode."""
    config = _create_config(JsonStrategy.STRUCTURED)
    llm = create_openai_chat_llm(config=config)
    response = await llm(
        "Please emit a json object with a random number in the 'value' key: e.g. {{\"value\": 100}}.",
        json_model=ValueModel,
    )
    assert response is not None
    assert response.output is not None
    assert response.parsed_json is not None
    assert isinstance(response.parsed_json, ValueModel)
    assert isinstance(response.parsed_json.value, int)
