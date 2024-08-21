# Copyright (c) 2024 Microsoft Corporation.

"""LLM generic variables."""

from typing import Any, TypeAlias, TypeVar

from pydantic import BaseModel

TInput = TypeVar("TInput", contravariant=True)
"""Raw input type used for the prompt."""

TOutput = TypeVar("TOutput")
"""Type of the raw output of LLM invocation."""

TJsonModel = TypeVar("TJsonModel", bound=BaseModel)
"""Model type used to parse the raw json output, if available."""

THistoryEntry = TypeVar("THistoryEntry")
"""Type of a history entry (chat mode)."""

TModelParameters = TypeVar("TModelParameters", contravariant=True)
"""Type of the parameters that can be forwarded to the model."""

PromptVariables: TypeAlias = dict[str, Any]
"""Indicates variables that can be to populate the prompt."""

JSON: TypeAlias = dict[Any, Any] | list[Any]
"""JSON represented in a python data structures."""
