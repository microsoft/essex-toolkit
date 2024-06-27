# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Error Types."""


class OutputAlreadyDefinedError(ValueError):
    """Output already defined error."""

    def __init__(self, name: str):
        """Initialize the OutputAlreadyDefinedError."""
        super().__init__(f"Output '{name}' is already defined.")


class OutputNotDefinedError(ValueError):
    """An exception for output not defined."""

    def __init__(self, output_name: str):
        super().__init__(f"Output '{output_name}' is not defined.")


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


class VerbAlreadyRegisteredError(ValueError):
    """An exception for already registered verb."""

    def __init__(self, name: str):
        super().__init__(f"Verb {name} already registered.")


class NodeIdAlreadyExistsError(ValueError):
    """An exception for adding a node that already exists."""

    def __init__(self, nid: str):
        super().__init__(f"Node {nid} already exists.")


class PortNamesMustBeUniqueError(ValueError):
    """An exception for non-unique port names."""

    def __init__(self):
        super().__init__("Port names must be unique.")
