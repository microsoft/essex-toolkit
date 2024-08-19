# Copyright (c) 2024 Microsoft Corporation.

"""LLM history tracking module for OpenAI."""

from collections.abc import Sequence

from fnllm.openai.llm.utils import chat_completion_message_to_param
from fnllm.openai.types.chat.io import OpenAIChatHistoryEntry, OpenAIChatOutput
from fnllm.services.history_extractor import HistoryExtractor


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
