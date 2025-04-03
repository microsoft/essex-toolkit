# Copyright (c) 2024 Microsoft Corporation.

"""TPM RPM limiter module."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from fnllm.types.io import LLMOutput

LimitReconciler = Callable[[LLMOutput[Any, Any, Any]], int | None]
"""A callable that will determine the actual number of items left in the limiter."""
