# Copyright (c) 2025 Microsoft Corporation.

"""Tests for the OpenAI embeddings REST LLM."""

from typing import TYPE_CHECKING
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from fnllm.openai.llm.openai_embeddings_rest_llm import \
    OpenAIEmbeddingsRestLLMImpl
from fnllm.openai.types.embeddings.io import OpenAIEmbeddingsOutput

if TYPE_CHECKING:
    from fnllm.openai.types.embeddings.parameters import \
        OpenAIEmbeddingsParameters


class TestOpenAIEmbeddingsRestLLM:
    """Test the OpenAI embeddings REST LLM implementation."""

    @pytest.fixture
    def llm(self):
        """Create a test LLM instance."""
        return OpenAIEmbeddingsRestLLMImpl(
            base_url="https://dev.microsoft.com",
            api_key="test-key",
            model="model",
        )

    @pytest.fixture
    def mock_response_data(self):
        """Mock response data from OpenAI API."""
        return {
            "object": "list",
            "data": [
                {
                    "object": "embedding",
                    "index": 0,
                    "embedding": [0.1, 0.2, 0.3, 0.4, 0.5],
                }
            ],
            "model": "text-embedding-3-small",
            "usage": {"prompt_tokens": 5, "total_tokens": 5},
        }

    @pytest.mark.asyncio
    async def test_build_url_openai(self, llm):
        """Test URL building for OpenAI."""
        url = llm._build_url()
        assert url == "https://dev.microsoft.com/model/v1/embeddings"

    @pytest.mark.asyncio
    async def test_build_url_azure(self):
        """Test URL building for Azure OpenAI."""
        llm = OpenAIEmbeddingsRestLLMImpl(
            base_url="https://test.openai.azure.com",
            api_key="test-key",
            model="test-deployment",
            api_version="2024-02-01",
        )
        url = llm._build_url()
        expected = "https://test.openai.azure.com/openai/deployments/test-deployment/embeddings?api-version=2024-02-01"
        assert url == expected

    @pytest.mark.asyncio
    async def test_prepare_request_body_openai(self, llm):
        """Test request body preparation for OpenAI."""
        prompt = "Test text"
        params = {"model": "text-embedding-3-small", "dimensions": 512}

        body = llm._prepare_request_body(prompt, params)

        expected = {
            "input": "Test text",
            "model": "text-embedding-3-small",
            "dimensions": 512,
        }
        assert body == expected

    @pytest.mark.asyncio
    async def test_prepare_request_body_azure(self):
        """Test request body preparation for Azure OpenAI."""
        llm = OpenAIEmbeddingsRestLLMImpl(
            base_url="https://test.openai.azure.com",
            api_key="test-key",
            model="test-deployment",
            api_version="2024-02-01",
        )

        prompt = "Test text"
        params: OpenAIEmbeddingsParameters = {
            "model": "test-deployment",
            "dimensions": 512,
        }

        body = llm._prepare_request_body(prompt, params)

        # Model should be removed for Azure deployments
        expected = {"input": "Test text", "dimensions": 512}
        assert body == expected

    @pytest.mark.asyncio
    async def test_execute_llm_success(self, llm, mock_response_data):
        """Test successful LLM execution."""
        # Mock the HTTP client
        mock_response = MagicMock()
        mock_response.json.return_value = mock_response_data
        mock_response.headers = None
        mock_response.raise_for_status.return_value = None

        with patch.object(
            llm._http_client, "post", new_callable=AsyncMock
        ) as mock_post:
            mock_post.return_value = mock_response

            result = await llm._execute_llm("Test text", {})

            assert isinstance(result, OpenAIEmbeddingsOutput)
            assert result.raw_input == "Test text"
            assert result.embeddings == [[0.1, 0.2, 0.3, 0.4, 0.5]]
            assert result.usage.input_tokens == 5  # type: ignore

    @pytest.mark.asyncio
    async def test_execute_llm_http_error(self, llm):
        """Test LLM execution with HTTP error."""
        from httpx import HTTPStatusError, Request, Response

        # Create a mock error response
        request = Request("POST", "https://api.openai.com/v1/embeddings")
        response = Response(400, json={"error": {"message": "Bad request"}})
        error = HTTPStatusError("Bad request", request=request, response=response)

        with patch.object(
            llm._http_client, "post", new_callable=AsyncMock
        ) as mock_post:
            mock_post.side_effect = error

            with pytest.raises(
                RuntimeError, match="HTTP 400 error from embeddings API"
            ):
                await llm._execute_llm("Test text", {})

    @pytest.mark.asyncio
    async def test_child_creation(self, llm):
        """Test child LLM creation."""
        # Create a mock cached service
        mock_cached = MagicMock()
        mock_cached.child.return_value = MagicMock()
        llm._cached = mock_cached

        child = llm.child("test-child")

        assert isinstance(child, OpenAIEmbeddingsRestLLMImpl)
        mock_cached.child.assert_called_once_with("test-child")

    @staticmethod
    def test_is_reasoning_model():
        """Test if the model is a reasoning model."""
        llm = OpenAIEmbeddingsRestLLMImpl(
            base_url="https://api.openai.com/v1",
            api_key="key",
            model="o3-mini",
        )

        assert llm.is_reasoning_model()

    @staticmethod
    def test_is_not_reasoning_model():
        """Test if the model is not a reasoning model."""
        llm = OpenAIEmbeddingsRestLLMImpl(
            base_url="https://api.openai.com/v1",
            api_key="key",
            model="other-model",
        )

        assert not llm.is_reasoning_model()
