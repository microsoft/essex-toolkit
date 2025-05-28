# Copyright (c) 2025 Microsoft Corporation.
"""Shared reactivedataflow Types."""

from collections.abc import Awaitable, Callable
from typing import TypeAlias

from .io import VerbInput, VerbOutput

VerbFunction: TypeAlias = Callable[[VerbInput], Awaitable[VerbOutput]]
FireCondition: TypeAlias = Callable[[VerbInput], bool]
EmitCondition: TypeAlias = Callable[[VerbInput, VerbOutput], bool]
