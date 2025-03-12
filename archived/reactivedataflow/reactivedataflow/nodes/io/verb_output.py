# Copyright (c) 2024 Microsoft Corporation.
"""Shared reactivedataflow Types."""

from dataclasses import dataclass, field
from typing import Any


@dataclass
class VerbOutput:
    """The result of a processing-node execution."""

    outputs: dict[str, Any] = field(default_factory=dict)
    """The named, non-default, outputs of the processing node."""

    no_output: bool = field(default=False)
    """Whether the processing node has no output."""
