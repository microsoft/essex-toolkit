# Copyright (c) 2024 Microsoft Corporation.

"""LLM base package."""

from .base import BaseLLM
from .protocol import LLM

__all__ = ["LLM", "BaseLLM"]
