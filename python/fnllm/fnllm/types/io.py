# Copyright (c) 2024 Microsoft Corporation.

"""LLM input/output types."""

from collections.abc import Sequence
from typing import Any, Generic

from pydantic import BaseModel, Field, field_serializer
from typing_extensions import NotRequired, TypedDict

from fnllm.tools.base import LLMTool

from .generics import (
    JSON,
    PromptVariables,
    THistoryEntry,
    TJsonModel,
    TModelParameters,
    TOutput,
)
from .metrics import LLMMetrics


class LLMInput(TypedDict, Generic[TJsonModel, THistoryEntry, TModelParameters]):
    """The input of an LLM invocation."""

    name: NotRequired[str]
    """The name of the LLM invocation, if available."""

    json: NotRequired[bool]
    """If present, will attempt to elicit JSON from the LLM. Parsed JSON will be returned in the `json_output` field."""

    json_model: NotRequired[type[TJsonModel]]
    """A model to check if an LLM response is valid. Only valid if `json=True`."""

    variables: NotRequired[PromptVariables]
    """The variable replacements to use in the prompt."""

    history: NotRequired[Sequence[THistoryEntry]]
    """The history of the LLM invocation, if available (e.g. chat mode)."""

    tools: NotRequired[Sequence[type[LLMTool]]]
    """Tools to make available to the model. These are classes that implement LLMTool."""

    model_parameters: NotRequired[TModelParameters]
    """Additional model parameters to use in the LLM invocation."""

    bypass_cache: NotRequired[bool]
    """Bypass the cache (if any) for this LLM invocation."""


class LLMOutput(BaseModel, Generic[TOutput, TJsonModel, THistoryEntry]):
    """The output of an LLM invocation."""

    output: TOutput
    """The output of the LLM invocation."""

    raw_json: JSON | None = None
    """The raw JSON output from the LLM, if available."""

    parsed_json: TJsonModel | None = None
    """The parsed JSON output with a base model, if available."""

    history: list[THistoryEntry] = Field(default_factory=list)
    """The history of the LLM invocation, if available (e.g. chat mode)."""

    tool_calls: list[LLMTool] = Field(default_factory=list)
    """Tool calls required by the LLM. These will be instances of the LLM tools (with filled parameters)."""

    metrics: LLMMetrics = Field(default_factory=LLMMetrics)
    """Request/response metrics."""

    @field_serializer("tool_calls")
    def serialize_tool_calls(
        self, tool_calls: list[LLMTool]
    ) -> list[dict[str, Any]] | None:
        """Custom serialization for the tool calls (handles polymorphic types)."""
        return [tool.model_dump() for tool in tool_calls]
