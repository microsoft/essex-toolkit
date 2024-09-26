# Copyright (c) 2024 Microsoft Corporation.
"""Shared reactivedataflow Types."""

from collections.abc import Awaitable, Callable
from typing import TypeAlias

from .io import VerbInput, VerbOutput

VerbFunction: TypeAlias = Callable[[VerbInput], Awaitable[VerbOutput]]
FireCondition: TypeAlias = Callable[[VerbInput], bool]
EmitCondition: TypeAlias = Callable[[VerbInput, VerbOutput], bool]


OnNodeStartCallback: TypeAlias = Callable[[str, str], None]
OnNodeFinishCallback: TypeAlias = Callable[[str, str, float], None]
Unsubscribe: TypeAlias = Callable[[], None]
