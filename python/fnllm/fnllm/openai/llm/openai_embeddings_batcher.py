# Copyright (c) 2025 Microsoft Corporation.
"""Process a function graph."""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING, TypeAlias

from numpy import average

from fnllm.utils.batch import Batcher, CallBatch

if TYPE_CHECKING:
    from fnllm.openai.llm.openai_embeddings_llm import OpenAIEmbeddingsLLMImpl
    from fnllm.openai.llm.openai_embeddings_rest_llm import OpenAIEmbeddingsRestLLMImpl
    from fnllm.openai.services.openai_text_service import OpenAITextService
    from fnllm.openai.types import OpenAIEmbeddingsLLM

    # Type alias for any compatible OpenAI embeddings LLM implementation
    OpenAIEmbeddingsLLMType = OpenAIEmbeddingsLLMImpl | OpenAIEmbeddingsRestLLMImpl

EmbeddingInput: TypeAlias = str
EmbeddingOutput: TypeAlias = list[float]
EmbeddingBatch: TypeAlias = CallBatch[EmbeddingInput, EmbeddingOutput]


class CannotSplitBatchError(ValueError):
    """Raised when a batch cannot be split."""


class OpenAIEmbeddingBatcher(Batcher[EmbeddingInput, EmbeddingOutput]):
    """
    A utility class to batch embeddings using OpenAI's API.

    This batcher works with both OpenAI SDK-based and REST API-based embeddings LLMs:
    - OpenAIEmbeddingsLLMImpl (uses OpenAI Python SDK)
    - OpenAIEmbeddingsRestLLMImpl (uses direct HTTP calls via httpx)
    """

    def __init__(
        self,
        *,
        llm: OpenAIEmbeddingsLLM,  # Works with both SDK and REST implementations
        text_service: OpenAITextService,
        max_batch_size: int,
        max_batch_tokens: int,
    ) -> None:
        super().__init__(
            max_batch_size=max_batch_size,
            max_batch_cost=max_batch_tokens,
        )
        self._llm = llm
        self._text_service = text_service

    def child(self, name: str) -> OpenAIEmbeddingBatcher:
        """Create a child batcher."""
        return OpenAIEmbeddingBatcher(
            llm=self._llm.child(name),
            text_service=self._text_service,
            max_batch_size=self.max_batch_size,
            max_batch_tokens=self.max_batch_cost,
        )

    def is_reasoning_model(self) -> bool:
        """Return whether the LLM uses a reasoning model."""
        return self._llm.is_reasoning_model()

    async def _invoke(
        self, batch: CallBatch[EmbeddingInput, EmbeddingOutput]
    ) -> list[EmbeddingOutput]:
        # Submit the batch
        if batch.cost <= self.max_batch_cost:
            response = await self._llm([c.input for c in batch.calls])
            result = response.output.embeddings
            if result is None:
                result = []
            return result

        if len(batch.calls) > 1:
            raise CannotSplitBatchError

        # This can happen if the first item is larger than the batch cost
        call = batch.calls[0]
        text_chunks = self._text_service.split(call.input, self.max_batch_cost)

        # Invoke the LLM and get the embeddings for each chunk
        chunk_embeddings = [self._llm([c.text]) for c in text_chunks]
        weights = [c.num_tokens for c in text_chunks]
        results = await asyncio.gather(*chunk_embeddings)
        results = [r.output.embeddings for r in results]
        results = [r[0] if r else [] for r in results]

        # Average the embeddings
        return [average(results, weights=weights, axis=0).tolist()]

    def _compute_cost(self, content: EmbeddingInput) -> int:
        return self._text_service.count_tokens(content)
