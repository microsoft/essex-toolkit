# Copyright (c) 2024 Microsoft Corporation.
"""Shared reactivedataflow Types."""

from enum import Enum


class OutputMode(str, Enum):
    """The output mode for an execution function."""

    Raw = "raw"
    """The output is a raw VerbOutput value, no decoration is required."""

    Value = "value"
    """The output is a single value"""

    Tuple = "tuple"
    """The output is a tuple of outputs"""
