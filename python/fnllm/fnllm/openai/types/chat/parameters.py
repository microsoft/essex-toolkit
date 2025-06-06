# Copyright (c) 2025 Microsoft Corporation.

"""OpenAI chat parameters types."""

from collections.abc import Iterable
from typing import Literal

from typing_extensions import NotRequired, TypedDict

from fnllm.openai.types.aliases import (
    OpenAIChatCompletionReasoningEffortParam,
    OpenAIChatCompletionToolChoiceOptionParam,
    OpenAIChatCompletionToolParam,
    OpenAIChatModelName,
    OpenAIFunctionCallCreateParam,
    OpenAIFunctionCreateParam,
    OpenAIResponseFormatCreateParam,
)


#
# Note: streaming options have been removed from this class to avoid downstream tying issues.
# OpenAI streaming should be handled with a StreamingLLM, not additional client-side parameters.
#
class OpenAIChatParameters(TypedDict):
    """OpenAI allowed chat parameters."""

    model: NotRequired[str | OpenAIChatModelName]

    frequency_penalty: NotRequired[float | None]

    function_call: NotRequired[OpenAIFunctionCallCreateParam]

    functions: NotRequired[Iterable[OpenAIFunctionCreateParam]]

    logit_bias: NotRequired[dict[str, int] | None]

    logprobs: NotRequired[bool | None]

    max_tokens: NotRequired[int | None]

    max_completion_tokens: NotRequired[int | None]

    n: NotRequired[int | None]

    parallel_tool_calls: NotRequired[bool]

    presence_penalty: NotRequired[float | None]

    response_format: NotRequired[OpenAIResponseFormatCreateParam]

    seed: NotRequired[int | None]

    service_tier: NotRequired[Literal["auto", "default"] | None]

    stop: NotRequired[str | list[str] | None]

    temperature: NotRequired[float | None]

    tool_choice: NotRequired[OpenAIChatCompletionToolChoiceOptionParam]

    tools: NotRequired[Iterable[OpenAIChatCompletionToolParam]]

    top_logprobs: NotRequired[int | None]

    top_p: NotRequired[float | None]

    user: NotRequired[str]

    timeout: NotRequired[float | None]

    reasoning_effort: NotRequired[OpenAIChatCompletionReasoningEffortParam]
