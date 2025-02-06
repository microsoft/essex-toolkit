# Copyright (c) 2024 Microsoft Corporation.

"""Generic LLM variables replacing module."""

from __future__ import annotations

from string import Template
from typing import TYPE_CHECKING, TypeVar, cast

if TYPE_CHECKING:
    from fnllm.types import PromptVariables

TInput = TypeVar("TInput")


class VariableInjector:
    """An variables replacing LLM."""

    def inject_variables(
        self, prompt: TInput, variables: PromptVariables | None
    ) -> TInput:
        """Call the LLM."""
        parsed_prompt = prompt

        if isinstance(parsed_prompt, str) and variables:
            parsed_prompt = Template(parsed_prompt).substitute(**variables)

        return cast(TInput, parsed_prompt)
