# Copyright (c) 2024 Microsoft Corporation.

"""OpenAI specific roles."""

from collections.abc import Sequence
from string import Template
from typing import Any, Final

from fnllm.openai.types.aliases import (
    OpenAIChatCompletionAssistantMessageParam,
    OpenAIChatCompletionFunctionMessageParam,
    OpenAIChatCompletionMessageToolCallParam,
    OpenAIChatCompletionSystemMessageParam,
    OpenAIChatCompletionToolMessageParam,
    OpenAIChatCompletionUserMessageParam,
    OpenAIFunctionCallParam,
)


class _OpenAIBaseRole:
    """OpenAI base class for roles."""

    role = "user"

    def _substitute_template(
        self, value: str | Template, variables: dict[str, Any] | None
    ) -> str:
        if isinstance(value, Template):
            return value.substitute(**(variables or {}))

        if variables:
            return Template(value).substitute(**variables)

        return value

    def __str__(self) -> str:
        """String representation of the role."""
        return self.role

    def __hash__(self) -> int:
        """Hash representation of the role."""
        return hash(self.role)


class _OpenAISystemRole(_OpenAIBaseRole):
    """OpenAI system role."""

    role: Final = "system"

    def message(
        self,
        content: str | Template,
        *,
        name: str | None = None,
        variables: dict[str, Any] | None = None,
    ) -> OpenAIChatCompletionSystemMessageParam:
        """Create a message for the given role."""
        msg = OpenAIChatCompletionSystemMessageParam(
            content=self._substitute_template(content, variables), role=self.role
        )

        if name is not None:
            msg["name"] = name

        return msg


class _OpenAIUserRole(_OpenAIBaseRole):
    """OpenAI user role."""

    role: Final = "user"

    def message(
        self,
        content: str | Template,
        *,
        name: str | None = None,
        variables: dict[str, Any] | None = None,
    ) -> OpenAIChatCompletionUserMessageParam:
        """Create a message for the given role."""
        msg = OpenAIChatCompletionUserMessageParam(
            content=self._substitute_template(content, variables), role=self.role
        )

        if name is not None:
            msg["name"] = name

        return msg


class _OpenAIAssistantRole(_OpenAIBaseRole):
    """OpenAI assistant role."""

    role: Final = "assistant"

    def message(
        self,
        content: str | Template | None = None,
        *,
        tool_calls: Sequence[OpenAIChatCompletionMessageToolCallParam] | None = None,
        function_call: OpenAIFunctionCallParam | None = None,
        name: str | None = None,
        variables: dict[str, Any] | None = None,
    ) -> OpenAIChatCompletionAssistantMessageParam:
        """Create a message for the given role."""
        msg = OpenAIChatCompletionAssistantMessageParam(
            content=self._substitute_template(content, variables)
            if content is not None
            else None,
            role=self.role,
        )

        if tool_calls is not None:
            msg["tool_calls"] = tool_calls

        if function_call is not None:
            msg["function_call"] = function_call

        if name is not None:
            msg["name"] = name

        return msg


class _OpenAIToolRole(_OpenAIBaseRole):
    """OpenAI tool role."""

    role: Final = "tool"

    def message(
        self,
        content: str | Template,
        tool_call_id: str,
        *,
        variables: dict[str, Any] | None = None,
    ) -> OpenAIChatCompletionToolMessageParam:
        """Create a message for the given role."""
        return OpenAIChatCompletionToolMessageParam(
            content=self._substitute_template(content, variables),
            tool_call_id=tool_call_id,
            role=self.role,
        )


class _OpenAIFunctionRole(_OpenAIBaseRole):
    """OpenAI function role."""

    role: Final = "function"

    def message(
        self,
        content: str | Template,
        name: str,
        *,
        variables: dict[str, Any] | None = None,
    ) -> OpenAIChatCompletionFunctionMessageParam:
        """Create a message for the given role."""
        return OpenAIChatCompletionFunctionMessageParam(
            content=self._substitute_template(content, variables),
            name=name,
            role=self.role,
        )


class OpenAIChatRole:
    """OpenAI chat roles."""

    System: Final = _OpenAISystemRole()

    User: Final = _OpenAIUserRole()

    Assistant: Final = _OpenAIAssistantRole()

    Tool: Final = _OpenAIToolRole()

    Function: Final = _OpenAIFunctionRole()
