# Copyright (c) 2024 Microsoft Corporation.

"""TPM RPM limiter module."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from fnllm.types.io import LLMOutput

LimitReconciler = Callable[[LLMOutput[Any, Any, Any]], int | None]
"""A callable that will determine the actual number of items left in the limiter."""


@dataclass
class Manifest:
    """Parameters for limiting."""

    request_tokens: int = 0
    """The number of tokens to acquire or release."""

    post_request_tokens: int = 0
    """The number of tokens to acquire or release after the request is complete."""


@dataclass
class Reconciliation:
    """A limit reconciliation."""

    old_value: float
    """The old limit value."""

    new_value: float
    """The new limit value."""
