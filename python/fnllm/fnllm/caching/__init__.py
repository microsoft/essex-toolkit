# Copyright (c) 2025 Microsoft Corporation.

"""Caching base package."""

from .base import Cache
from .file import FileCache

__all__ = ["Cache", "FileCache"]
