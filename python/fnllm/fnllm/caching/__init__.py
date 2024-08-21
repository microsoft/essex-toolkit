# Copyright (c) 2024 Microsoft Corporation.

"""Caching base package."""

from .base import Cache
from .file import FileCache

__all__ = ["Cache", "FileCache"]
