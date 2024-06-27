# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Error Types."""


class NodeAlreadyDefinedError(ValueError):
    """An exception for adding a node that already exists."""

    def __init__(self, nid: str):
        super().__init__(f"Node {nid} already defined.")


class NodeNotFoundError(KeyError):
    """An exception for unknown node."""

    def __init__(self, nid: str):
        super().__init__(f"Node {nid} not found.")


class OutputAlreadyDefinedError(ValueError):
    """Output already defined error."""

    def __init__(self, name: str):
        """Initialize the OutputAlreadyDefinedError."""
        super().__init__(f"Output '{name}' is already defined.")


class OutputNotFoundError(ValueError):
    """An exception for output not defined."""

    def __init__(self, output_name: str):
        super().__init__(f"Output '{output_name}' not found.")


class OutputNamesMissingInTupleOutputModeError(ValueError):
    """An exception for missing output names in tuple output mode."""

    def __init__(self):
        super().__init__("Output names are required in tuple output mode.")


class OutputNamesNotValidInValueOutputModeError(ValueError):
    """An exception for output names in value output mode."""

    def __init__(self):
        super().__init__("Output names are not allowed in Value output mode")


class VerbNotFoundError(KeyError):
    """An exception for unknown verb."""

    def __init__(self, name: str):
        super().__init__(f"Unknown verb: {name}")


class VerbAlreadyDefinedError(ValueError):
    """An exception for already defined verb."""

    def __init__(self, name: str):
        super().__init__(f"Verb {name} already defined.")


class PortNamesMustBeUniqueError(ValueError):
    """An exception for non-unique port names."""

    def __init__(self):
        super().__init__("Port names must be unique.")
