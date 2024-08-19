# Copyright (c) 2024 Microsoft Corporation.


"""LLM Configuration Protocol definition."""

from enum import Enum


class JsonStrategy(str, Enum):
    """The strategy to use for JSON parsing."""

    Loose = "loose"
    """Manual JSON parsing. Your prompt should request JSON, and the LLM will attempt to parse it, re-invoking the LLM if necessary to clean up the output."""

    Valid = "valid"
    """The LLM is contractually obligated to return valid JSON, although it may not conform to a schema."""

    Schematic = "schematic"
    """The LLM is contractually obligated to return valid JSON that conforms to a schema."""
