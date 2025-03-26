# Copyright (c) 2024 Microsoft Corporation.
"""Shared reactivedataflow Types."""

from enum import Enum


class InputMode(str, Enum):
    """The input mode for an execution function."""

    Raw = "raw"
    """The input is a raw VerbInput value, no decoration is required."""

    PortMapped = "port_mapped"
    """Use port specifications to infer function inputs."""
