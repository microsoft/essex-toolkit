# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation for OpenAI."""

from __future__ import annotations

import json
from typing import TYPE_CHECKING, Final, Generic

from openai import APIConnectionError, InternalServerError, RateLimitError

from fnllm.base.services.rate_limiter import RateLimiter
from fnllm.events.base import LLMEvents
from fnllm.openai.utils import llm_tools_to_param
from fnllm.types.generics import (
    THistoryEntry,
    TInput,
    TJsonModel,
    TModelParameters,
    TOutput,
)

if TYPE_CHECKING:
    from tiktoken import Encoding

    from fnllm.limiting import Limiter
    from fnllm.types.io import LLMInput

OPENAI_RETRYABLE_ERRORS: Final[list[type[Exception]]] = [
    RateLimitError,
    APIConnectionError,
    InternalServerError,
]


class OpenAIRateLimiter(
    RateLimiter[TInput, TOutput, THistoryEntry, TModelParameters],
    Generic[TInput, TOutput, THistoryEntry, TModelParameters],
):
    """A base class to rate limit the LLM."""

    def __init__(
        self,
        limiter: Limiter,
        encoder: Encoding,
        *,
        events: LLMEvents | None = None,
    ):
        """Create a new BaseRateLimitLLM."""
        super().__init__(
            limiter,
            events=events or LLMEvents(),
        )
        self._encoding = encoder

    def _estimate_request_tokens(
        self,
        prompt: TInput,
        kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters],
    ) -> int:
        history = kwargs.get("history", [])
        tools = llm_tools_to_param(kwargs.get("tools", []))

        return sum(
            len(self._encoding.encode(json.dumps(entry)))
            for entry in (*history, *tools, prompt)
        )
