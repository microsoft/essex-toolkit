# Copyright (c) 2024 Microsoft Corporation.
"""Shared reactivedataflow Types."""

from collections.abc import Callable

from .io import VerbInput, VerbOutput

VerbFunction = Callable[[VerbInput], VerbOutput]
FireCondition = Callable[[VerbInput], bool]
EmitCondition = Callable[[VerbInput, VerbOutput], bool]
