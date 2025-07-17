# Copyright (c) 2025 Microsoft Corporation.

"""OpenAI parsing utilities."""

from __future__ import annotations

from typing import TYPE_CHECKING, cast

from fnllm.openai.config import OpenAISpecialTokenBehavior
from fnllm.openai.types.aliases import (
    OpenAIChatCompletionAssistantMessageParam,
    OpenAIChatCompletionMessageModel,
    OpenAIChatCompletionMessageToolCallModel,
    OpenAIChatCompletionMessageToolCallParam,
    OpenAIChatCompletionToolParam,
    OpenAIChatCompletionUserMessageParam,
    OpenAIFunctionCallModel,
    OpenAIFunctionCallParam,
    OpenAIFunctionDefinitionParam,
    OpenAIFunctionModel,
    OpenAIFunctionParam,
)
from fnllm.openai.types.chat.io import OpenAIChatCompletionInput, OpenAIChatHistoryEntry

if TYPE_CHECKING:
    from collections.abc import Iterable, Sequence

    from fnllm.tools.base import LLMTool

_reasoning_models: set[str] = {"o1", "o1-mini", "o3-mini"}
_special_tokens: set[str] = {
    "<|endoftext|>",
    "<|fim_prefix|>",
    "<|fim_middle|>",
    "<|fim_suffix|>",
    "<|endofprompt|>",
}
_special_token_replacements: dict[str, str] = {
    "<|endoftext|>": "[END_OF_TEXT]",
    "<|fim_prefix|>": "[FIM_PREFIX]",
    "<|fim_middle|>": "[FIM_MIDDLE]",
    "<|fim_suffix|>": "[FIM_SUFFIX]",
    "<|endofprompt|>": "[END_OF_PROMPT]",
}


def function_call_to_param(
    func: OpenAIFunctionCallModel | None,
) -> OpenAIFunctionCallParam | None:
    """Parses FunctionCall base model to the equivalent typed dict."""
    if not func:
        return None

    return OpenAIFunctionCallParam(
        arguments=func.arguments,
        name=func.name,
    )


def function_to_param(func: OpenAIFunctionModel) -> OpenAIFunctionParam:
    """Parses Function base model to the equivalent typed dict."""
    return OpenAIFunctionParam(arguments=func.arguments, name=func.name)


def tool_calls_to_params(
    tools: list[OpenAIChatCompletionMessageToolCallModel] | None,
) -> Sequence[OpenAIChatCompletionMessageToolCallParam] | None:
    """Parses a list of ChatCompletionMessageToolCall base model to the equivalent typed dict."""
    if not tools:
        return None

    return [
        OpenAIChatCompletionMessageToolCallParam(
            id=tool.id, function=function_to_param(tool.function), type=tool.type
        )
        for tool in tools
    ]


def llm_tool_to_param(tool: type[LLMTool]) -> OpenAIFunctionDefinitionParam:
    """Parses a class that implements LLMTool to the equivalent typed dict."""
    return OpenAIFunctionDefinitionParam(
        name=tool.get_name(),
        description=tool.get_description(),
        parameters=tool.get_parameters_schema(),
    )


def llm_tools_to_param(
    tools: Sequence[type[LLMTool]],
) -> Iterable[OpenAIChatCompletionToolParam]:
    """Parses a list of classes that implements LLMTool to the equivalent typed dicts."""
    return [
        OpenAIChatCompletionToolParam(
            function=llm_tool_to_param(tool),
            type="function",
        )
        for tool in tools
    ]


def chat_completion_message_to_param(
    message: OpenAIChatCompletionMessageModel,
) -> OpenAIChatCompletionAssistantMessageParam:
    """Parses ChatCompletionMessage base model to the equivalent typed dict."""
    param = OpenAIChatCompletionAssistantMessageParam(
        role=message.role, content=message.content
    )

    function_call = function_call_to_param(message.function_call)

    if function_call:
        param["function_call"] = function_call

    tool_calls = tool_calls_to_params(message.tool_calls)

    if tool_calls:
        param["tool_calls"] = tool_calls

    return param


def build_chat_messages(
    prompt: OpenAIChatCompletionInput,
    history: Sequence[OpenAIChatHistoryEntry],
    special_token_behavior: OpenAISpecialTokenBehavior,
) -> tuple[list[OpenAIChatHistoryEntry], OpenAIChatHistoryEntry]:
    """Builds a chat history list from the prompt and existing history, along with the prompt message."""
    prompt = _rewrite_prompt(prompt, special_token_behavior)
    if isinstance(prompt, str):
        prompt = OpenAIChatCompletionUserMessageParam(
            content=prompt,
            role="user",
        )
    messages = [*history]
    if prompt is not None:
        messages.append(prompt)
    return messages, cast(OpenAIChatHistoryEntry, prompt)


def _rewrite_prompt(
    prompt: OpenAIChatCompletionInput,
    special_token_behavior: OpenAISpecialTokenBehavior,
) -> OpenAIChatCompletionInput:
    """Rewrite the prompt based on the special token behavior."""
    prompt_content: str = ""
    if prompt is None:
        return prompt

    if isinstance(prompt, str):
        prompt_content = prompt
    else:
        prompt_content = cast(str, prompt.get("content", ""))

    if special_token_behavior == OpenAISpecialTokenBehavior.REMOVE:
        for token in _special_tokens:
            prompt_content = prompt_content.replace(token, "").strip()
    elif special_token_behavior == OpenAISpecialTokenBehavior.REPLACE:
        for token, replacement in _special_token_replacements.items():
            prompt_content = prompt_content.replace(token, replacement)

    return OpenAIChatCompletionUserMessageParam(content=prompt_content, role="user")


def is_reasoning_model(model: str) -> bool:
    """Return whether the model uses a reasoning model."""
    return model.lower() in _reasoning_models
