# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Inputs Decorator."""

from collections.abc import Callable
from typing import Any, ParamSpec, TypeVar, cast

from reactivedataflow.nodes import VerbInput
from reactivedataflow.ports import Ports

T = TypeVar("T")
P = ParamSpec("P")


def connect_input(
    ports: Ports,
) -> Callable[[Callable[P, T]], Callable[[VerbInput], T]]:
    """Decorate an execution function with input conditions.

    Args:
        required (list[str] | None): The list of required input names. Defaults to None. If present, the function will only execute if all required inputs are present.
    """

    def wrap_fn(
        fn: Callable[P, T],
    ) -> Callable[[VerbInput], T]:
        def wrapped_fn(inputs: VerbInput, *args: P.args, **kwargs: P.kwargs) -> T:
            fn_kwargs = {**kwargs}

            # Inject named-input Dictionary
            named_inputs_port = ports.named_inputs
            if (
                named_inputs_port is not None
                and named_inputs_port.parameter is not None
            ):
                fn_kwargs[named_inputs_port.parameter] = inputs.named_inputs

            # Inject array-ports
            array_port = ports.array_input
            if array_port is not None and array_port.parameter is not None:
                fn_kwargs[array_port.parameter] = inputs.array_inputs

            # Inject named ports
            fn_kwargs.update({
                p.parameter or p.name: inputs.named_inputs.get(p.name)
                for p in ports.input
            })
            # Inject config ports
            fn_kwargs.update({
                p.parameter or p.name: inputs.config.get(p.name) for p in ports.config
            })

            return cast(Any, fn)(*args, **fn_kwargs)

        wrapped_fn.__qualname__ = f"{fn.__qualname__}_wrapin"
        return cast(Any, wrapped_fn)

    return wrap_fn
