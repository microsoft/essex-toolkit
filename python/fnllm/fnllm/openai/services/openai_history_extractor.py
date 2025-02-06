# Copyright (c) 2024 Microsoft Corporation.

"""LLM history tracking module for OpenAI."""

from __future__ import annotations

from typing import TYPE_CHECKING

from fnllm.base.services.history_extractor import HistoryExtractor
from fnllm.openai.types.chat.io import OpenAIChatHistoryEntry, OpenAIChatOutput
from fnllm.openai.utils import chat_completion_message_to_param

if TYPE_CHECKING:
    from collections.abc import Sequence


class OpenAIHistoryExtractor(
    HistoryExtractor[OpenAIChatOutput, OpenAIChatHistoryEntry]
):
    """An OpenAI history-tracking LLM."""

    def extract_history(
        self,
        history: Sequence[OpenAIChatHistoryEntry] | None,
        output: OpenAIChatOutput,
    ) -> list[OpenAIChatHistoryEntry]:
        """Call the LLM."""
        result = [*history] if history else []

        if output.raw_input is not None:
            result.append(output.raw_input)

        result.append(chat_completion_message_to_param(output.raw_output))

        return result
