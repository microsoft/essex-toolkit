# Copyright (c) 2024 Microsoft Corporation.


"""LLM Configuration Protocol definition."""

from __future__ import annotations

from enum import Enum


class JsonStrategy(str, Enum):
    """The strategy to use for JSON parsing."""

    NONE = "none"
    """Don't parse JSON. The LLM will return whatever it wants."""

    LOOSE = "loose"
    """Manual JSON parsing. Your prompt should request JSON, and the LLM will attempt to parse it, re-invoking the LLM if necessary to clean up the output."""

    VALID = "valid"
    """The LLM is contractually obligated to return valid JSON, although it may not conform to a schema."""

    STRUCTURED = "structured"
    """The LLM is contractually obligated to return valid JSON that conforms to a schema."""
