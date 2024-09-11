# Copyright (c) 2024 Microsoft Corporation.
"""Shared reactivedataflow Types."""

from collections.abc import Awaitable, Callable

from .io import VerbInput, VerbOutput

VerbFunction = Callable[[VerbInput], Awaitable[VerbOutput]]
FireCondition = Callable[[VerbInput], bool]
EmitCondition = Callable[[VerbInput, VerbOutput], bool]
