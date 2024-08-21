# Copyright (c) 2024 Microsoft Corporation.
# Licensed under the MIT License

"""LLM base tool implementations."""

from collections.abc import Sequence
from functools import lru_cache
from typing import Any, ClassVar, cast

from pydantic import BaseModel, computed_field


class LLMTool(BaseModel):
    """Base class for tools that can be made available to the model."""

    __tool_name__: ClassVar[str | None] = None
    """Override this to replace the tool name generated from the class name by default."""

    __tool_description__: ClassVar[str | None] = None
    """Override this to replace the tool description generated from the class documentation by default."""

    __raw_arguments_json__: str | None = None
    """Raw arguments provided as a string by the model."""

    call_id: str | None = None
    """Tool call ID provided when asking for this tool to be called."""

    @computed_field
    @property
    def name(self) -> str:
        """Tool name."""
        return self.get_name()

    @computed_field
    @property
    def description(self) -> str:
        """Tool description."""
        return self.get_description()

    async def execute(self) -> Any:
        """Can be implemented to execute the tool."""
        return None

    @classmethod
    @lru_cache
    def get_name(cls) -> str:
        """Getter for the tool name (class specific)."""
        return cls.__tool_name__ or cast(str, cls.get_json_schema().get("title", ""))

    @classmethod
    @lru_cache
    def get_description(cls) -> str:
        """Getter for the tool description (class specific)."""
        return cls.__tool_description__ or cast(
            str, cls.get_json_schema().get("description", "")
        )

    @classmethod
    @lru_cache
    def get_json_schema(cls) -> dict[str, object]:
        """JSON schema for the base tool (class specific)."""
        return cls.model_json_schema()

    @classmethod
    @lru_cache
    def get_parameters_schema(cls) -> dict[str, object]:
        """Parameters schema for the base tool (class specific)."""
        schema = cls.model_json_schema()

        if "title" in schema:
            del schema["title"]

        if "description" in schema:
            del schema["description"]

        del schema["properties"]["call_id"]

        return schema

    @staticmethod
    def find_tool(
        tools: Sequence[type["LLMTool"]],
        name: str,
    ) -> type["LLMTool"] | None:
        """Find the tool that matches the given name if any. Otherwise return `None`."""
        return next(filter(lambda x: x.get_name() == name, tools), None)
