# Copyright (c) 2024 Microsoft Corporation.

"""OpenAI aliases types."""

from collections.abc import Sequence
from typing import Literal, TypeAlias

from openai.types.chat import (
    ChatCompletion as ChatCompletionModel,
)
from openai.types.chat import (
    ChatCompletionMessage as ChatCompletionMessageModel,
)
from openai.types.chat import ChatCompletionReasoningEffort
from openai.types.chat.chat_completion import Choice as ChoiceModel
from openai.types.chat.chat_completion_assistant_message_param import (
    FunctionCall as FunctionCallParam,
)
from openai.types.chat.chat_completion_function_message_param import (
    ChatCompletionFunctionMessageParam,
)
from openai.types.chat.chat_completion_message import FunctionCall as FunctionCallModel
from openai.types.chat.chat_completion_message_tool_call import (
    ChatCompletionMessageToolCall as ChatCompletionMessageToolCallModel,
)
from openai.types.chat.chat_completion_message_tool_call import (
    Function as FunctionModel,
)
from openai.types.chat.chat_completion_message_tool_call_param import (
    ChatCompletionMessageToolCallParam,
)
from openai.types.chat.chat_completion_message_tool_call_param import (
    Function as FunctionParam,
)
from openai.types.chat.chat_completion_stream_options_param import (
    ChatCompletionStreamOptionsParam,
)
from openai.types.chat.chat_completion_system_message_param import (
    ChatCompletionSystemMessageParam,
)
from openai.types.chat.chat_completion_tool_choice_option_param import (
    ChatCompletionToolChoiceOptionParam,
)
from openai.types.chat.chat_completion_tool_message_param import (
    ChatCompletionToolMessageParam,
)
from openai.types.chat.chat_completion_tool_param import ChatCompletionToolParam
from openai.types.chat.chat_completion_user_message_param import (
    ChatCompletionUserMessageParam,
)
from openai.types.chat.completion_create_params import (
    Function as FunctionCreateParam,
)
from openai.types.chat.completion_create_params import (
    FunctionCall as FunctionCallCreateParam,
)
from openai.types.chat.completion_create_params import (
    ResponseFormat as ResponseFormatCreateParam,
)
from openai.types.chat_model import ChatModel as ChatModelName
from openai.types.completion_usage import CompletionUsage as CompletionUsageModel
from openai.types.create_embedding_response import (
    CreateEmbeddingResponse as CreateEmbeddingResponseModel,
)
from openai.types.create_embedding_response import Usage as EmbeddingUsageModel
from openai.types.embedding import Embedding as EmbeddingModel
from openai.types.embedding_model import EmbeddingModel as EmbeddingModelName
from openai.types.shared_params.function_definition import (
    FunctionDefinition as FunctionDefinitionParam,
)
from typing_extensions import Required, TypedDict

OpenAIEmbeddingModelName: TypeAlias = EmbeddingModelName
"""Alias for the EmbeddingModel (available model types)."""

OpenAIChatModelName: TypeAlias = ChatModelName
"""Alias for the ChatModel (available model types)."""

OpenAICompletionUsageModel: TypeAlias = CompletionUsageModel
"""Alias for the CompletionUsage (base model)."""

OpenAIChatCompletionStreamOptionsParam: TypeAlias = ChatCompletionStreamOptionsParam
"""Alias for the ChatCompletionStreamOptionsParam (param)."""

OpenAIChatCompletionModel: TypeAlias = ChatCompletionModel
"""Alias for the ChatCompletion (base model)."""

OpenAIChatCompletionMessageModel: TypeAlias = ChatCompletionMessageModel
"""Alias for the ChatCompletionMessage (base model)."""

OpenAIChoiceModel: TypeAlias = ChoiceModel
"""Alias for the Choice (base model)."""

OpenAIFunctionModel: TypeAlias = FunctionModel
"""Alias for the Function (base model)."""

OpenAIFunctionParam: TypeAlias = FunctionParam
"""Alias for the Function (param)."""

OpenAIFunctionCreateParam: TypeAlias = FunctionCreateParam
"""Alias for the Function (create param)."""

OpenAIFunctionCallModel: TypeAlias = FunctionCallModel
"""Alias for the FunctionCall (base model)."""

OpenAIFunctionCallParam: TypeAlias = FunctionCallParam
"""Alias for the FunctionCall (param)."""

OpenAIFunctionCallCreateParam: TypeAlias = FunctionCallCreateParam
"""Alias for the FunctionCall (create param)."""

OpenAIFunctionDefinitionParam: TypeAlias = FunctionDefinitionParam
"""Alias for the FunctionDefinition (param)."""

OpenAIResponseFormatCreateParam: TypeAlias = ResponseFormatCreateParam
"""Alias for the ResponseFormatCreateParam (create param)."""

OpenAIChatCompletionMessageToolCallModel: TypeAlias = ChatCompletionMessageToolCallModel
"""Alias for the ChatCompletionMessageToolCall (base model)."""

OpenAIChatCompletionToolParam: TypeAlias = ChatCompletionToolParam
"""Alias for the ChatCompletionToolParam (param)."""

OpenAIChatCompletionMessageToolCallParam: TypeAlias = ChatCompletionMessageToolCallParam
"""Alias for the ChatCompletionMessageToolCallParam (param)."""

OpenAIChatCompletionToolChoiceOptionParam: TypeAlias = (
    ChatCompletionToolChoiceOptionParam
)
"""Alias for the ChatCompletionToolChoiceOptionParam (param)."""


# NOTE:
# This is done to avoid using an Iterator for the `tool_calls`,
# which when combined with pydantic will result in a generator that
# can only be iterated once
class _ChatCompletionAssistantMessageParam(TypedDict, total=False):
    """Shadow ChatCompletionAssistantMessageParam from OpenAI."""

    role: Required[Literal["assistant"]]
    """The role of the messages author, in this case `assistant`."""

    content: str | None
    """The contents of the assistant message.

    Required unless `tool_calls` or `function_call` is specified.
    """

    function_call: OpenAIFunctionCallParam | None
    """Deprecated and replaced by `tool_calls`.

    The name and arguments of a function that should be called, as generated by the
    model.
    """

    name: str
    """An optional name for the participant.

    Provides the model information to differentiate between participants of the same
    role.
    """

    tool_calls: Sequence[OpenAIChatCompletionMessageToolCallParam]
    """The tool calls generated by the model, such as function calls."""


OpenAIChatCompletionSystemMessageParam: TypeAlias = ChatCompletionSystemMessageParam
"""Alias for the ChatCompletionSystemMessageParam (param)."""

OpenAIChatCompletionUserMessageParam: TypeAlias = ChatCompletionUserMessageParam
"""Alias for the ChatCompletionUserMessageParam (param)."""

OpenAIChatCompletionAssistantMessageParam: TypeAlias = (
    _ChatCompletionAssistantMessageParam
)
"""Alias for the ChatCompletionAssistantMessageParam (param)."""

OpenAIChatCompletionToolMessageParam: TypeAlias = ChatCompletionToolMessageParam
"""Alias for the ChatCompletionToolMessageParam (param)."""

OpenAIChatCompletionFunctionMessageParam: TypeAlias = ChatCompletionFunctionMessageParam
"""Alias for the ChatCompletionFunctionMessageParam (param)."""

OpenAIChatCompletionMessageParam: TypeAlias = (
    OpenAIChatCompletionSystemMessageParam
    | OpenAIChatCompletionUserMessageParam
    | OpenAIChatCompletionAssistantMessageParam
    | OpenAIChatCompletionToolMessageParam
    | OpenAIChatCompletionFunctionMessageParam
)
"""OpenAI possible chat completion message types (param)."""

OpenAICreateEmbeddingResponseModel: TypeAlias = CreateEmbeddingResponseModel
"""Alias for the CreateEmbeddingResponse (base model)."""

OpenAIEmbeddingModel: TypeAlias = EmbeddingModel
"""Alias for the Embedding (base model)."""

OpenAIEmbeddingUsageModel: TypeAlias = EmbeddingUsageModel
"""Alias for the EmbeddingUsage (base model)."""

OpenAIChatCompletionReasoningEffortParam: TypeAlias = ChatCompletionReasoningEffort
"""Alias for the ChatCompletionReasoningEffort (param)."""
