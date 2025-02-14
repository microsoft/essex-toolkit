# Copyright (c) 2024 Microsoft Corporation.

"""Rate limiting LLM implementation for OpenAI."""

from __future__ import annotations

import json
from typing import TYPE_CHECKING, Generic

from fnllm.openai.utils import llm_tools_to_param
from fnllm.types.generics import THistoryEntry, TInput, TJsonModel, TModelParameters

if TYPE_CHECKING:
    from tiktoken import Encoding

    from fnllm.types.io import LLMInput


class OpenAITokenEstimator(Generic[TInput]):
    """Estimate the number of tokens needed for an OpenAI request."""

    def __init__(self, encoding: Encoding):
        self._encoding = encoding

    def __call__(
        self,
        prompt: TInput,
        kwargs: LLMInput[TJsonModel, THistoryEntry, TModelParameters],
    ) -> int:
        """Estimate the number of tokens needed for an OpenAI request."""
        history = kwargs.get("history", [])
        tools = llm_tools_to_param(kwargs.get("tools", []))

        return sum(
            len(self._encoding.encode(json.dumps(entry)))
            for entry in (*history, *tools, prompt)
        )
