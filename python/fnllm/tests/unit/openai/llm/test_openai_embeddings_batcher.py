# Copyright (c) 2024 Microsoft Corporation.
"""Embedding batcher tests."""

from typing import Any
from unittest.mock import AsyncMock, Mock

from fnllm.openai.llm.openai_embeddings_batcher import OpenAIEmbeddingBatcher


def embeddings_response(embeddings: list[list[float]]) -> Any:
    result = Mock()
    result.output = Mock()
    result.output.embeddings = embeddings
    return result


async def test_embeddings_batcher_init():
    llm = AsyncMock()
    text_service = Mock()
    text_service.count_tokens = Mock()
    text_service.count_tokens.return_value = 5
    batcher = OpenAIEmbeddingBatcher(
        llm=llm,
        text_service=text_service,
        max_batch_size=2,
        max_batch_tokens=10,
    )

    assert batcher._max_batch_size == 2
    assert batcher._max_batch_cost == 10
    assert batcher._current_batch.calls == []

    await batcher.flush()


async def test_batcher_single_call():
    llm = AsyncMock()

    text_service = Mock()
    text_service.count_tokens = Mock()
    text_service.count_tokens.return_value = 5
    batcher = OpenAIEmbeddingBatcher(
        llm=llm,
        text_service=text_service,
        max_batch_size=1,
        max_batch_tokens=10,
    )

    content = "content"
    response = [1.0, 2.0]
    llm.return_value = embeddings_response([response])

    embeddings_future = batcher(content)
    await batcher.flush()
    embeddings = await embeddings_future
    assert embeddings == response
    llm.assert_called_once_with([content])


async def test_batcher_single_call_under_batch_size():
    llm = AsyncMock()

    text_service = Mock()
    text_service.count_tokens = Mock()
    text_service.count_tokens.return_value = 5
    batcher = OpenAIEmbeddingBatcher(
        llm=llm,
        text_service=text_service,
        max_batch_size=2,
        max_batch_tokens=10,
    )

    content = "content"
    response = [1.0, 2.0]
    llm.return_value = embeddings_response([response])

    embeddings_future = batcher(content)
    await batcher.flush()

    embeddings = await embeddings_future
    assert embeddings == response
    llm.assert_called_once_with([content])


async def test_batcher_two_calls_under_batch_size():
    llm = AsyncMock()

    text_service = Mock()
    text_service.count_tokens = Mock()
    text_service.count_tokens.return_value = 1
    batcher = OpenAIEmbeddingBatcher(
        llm=llm,
        text_service=text_service,
        max_batch_size=3,
        max_batch_tokens=10,
    )

    content = "content"
    r1 = [1.0, 2.0]
    r2 = [3.0, 4.0]
    llm.return_value = embeddings_response([r1, r2])

    f1 = batcher(content)
    f2 = batcher(content)
    await batcher.flush()

    e1 = await f1
    e2 = await f2
    assert e1 == r1
    assert e2 == r2
    llm.assert_called_once_with([content, content])


async def test_batcher_two_calls_over_batch_size():
    llm = AsyncMock()
    text_service = Mock()
    text_service.count_tokens = Mock()
    text_service.count_tokens.return_value = 1
    batcher = OpenAIEmbeddingBatcher(
        llm=llm,
        text_service=text_service,
        max_batch_size=1,
        max_batch_tokens=10,
    )

    content = "content"
    r1 = [1.0, 2.0]
    r2 = [3.0, 4.0]
    llm.side_effect = [embeddings_response([r1]), embeddings_response([r2])]

    f1 = batcher(content)
    f2 = batcher(content)
    await batcher.flush()

    e1 = await f1
    e2 = await f2
    assert e1 == r1
    assert e2 == r2
    assert llm.call_count == 2
