# Copyright (c) 2024 Microsoft Corporation.
"""Shared reactivedataflow Types."""

from enum import Enum


class EmitMode(str, Enum):
    """The emission mode for an execution function."""

    All = "all"
    """The output is a raw VerbOutput value, no decoration is required."""

    OnChange = "on_change"
    """Only emit the output if it has changed from the previous output."""
