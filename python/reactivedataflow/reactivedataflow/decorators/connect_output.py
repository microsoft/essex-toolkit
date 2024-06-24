# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Outputs Decorator."""

from collections.abc import Callable
from typing import Any, ParamSpec, TypeVar, cast

from reactivedataflow.constants import default_output
from reactivedataflow.errors import (
    OutputNamesMissingInTupleOutputModeError,
    OutputNamesNotValidInValueOutputModeError,
)
from reactivedataflow.nodes import (
    OutputMode,
    VerbOutput,
)

P = ParamSpec("P")
T = TypeVar("T")


def connect_output(
    mode: OutputMode = OutputMode.Value,
    output_names: list[str] | None = None,
) -> Callable[[Callable[P, Any]], Callable[P, VerbOutput]]:
    """Decorate an execution function with output conditions.

    Args:
        default_output (bool): The default output of the function.
    """
    if mode == OutputMode.Tuple and output_names is None:
        raise OutputNamesMissingInTupleOutputModeError

    if mode == OutputMode.Value and output_names is not None:
        raise OutputNamesNotValidInValueOutputModeError

    def wrap_fn(fn: Callable[P, Any]) -> Callable[P, VerbOutput]:
        def wrapped_fn(*args: P.args, **kwargs: P.kwargs) -> VerbOutput:
            result = fn(*args, **kwargs)
            match mode:
                case OutputMode.Raw:
                    return result
                case OutputMode.Value:
                    return VerbOutput(
                        outputs={default_output: result},
                    )
                case OutputMode.Tuple:
                    result = list(cast(tuple, result))
                    return VerbOutput(
                        outputs=dict(
                            zip(cast(list[str], output_names), result, strict=True)
                        ),
                    )

        wrapped_fn.__qualname__ = f"{fn.__qualname__}_wrapout"
        return wrapped_fn

    return wrap_fn
