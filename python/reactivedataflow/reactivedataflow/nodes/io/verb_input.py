# Copyright (c) 2024 Microsoft Corporation.
"""Shared reactivedataflow Types."""

from dataclasses import dataclass, field
from typing import Any


@dataclass
class VerbInput:
    """Inputs to a processing node."""

    config: dict[str, Any] = field(default_factory=dict)
    """The configuration of the processing node."""

    named_inputs: dict[str, Any] = field(default_factory=dict)
    """The named inputs of the processing node."""

    array_inputs: list[Any] = field(default_factory=list)
    """The array inputs of the processing node."""

    previous_output: dict[str, Any] = field(default_factory=dict)
    """The previous output of the processing node."""
