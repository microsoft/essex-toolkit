# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Error Types."""


class GraphHasCyclesError(ValueError):
    """An exception for a cycle detected in the graph."""

    def __init__(self):
        """Initialize the CycleDetectedError."""
        super().__init__("Cycle detected in the graph.")


class RequiredNodeInputNotFoundError(ValueError):
    """An exception for required input not found."""

    def __init__(self, nid: str, input_name: str):
        """Initialize the RequiredNodeInputNotFoundError."""
        super().__init__(f"Node {nid} is missing required input '{input_name}'.")


class RequiredNodeArrayInputNotFoundError(ValueError):
    """An exception for required array input not found."""

    def __init__(self, nid: str):
        """Initialize the RequiredNodeInputNotFoundError."""
        super().__init__(f"Node {nid} is missing required array input.")


class RequiredNodeConfigNotFoundError(ValueError):
    """An exception for required input not found."""

    def __init__(self, nid: str, config_key: str):
        """Initialize the RequiredNodeInputNotFoundError."""
        super().__init__(f"Node {nid} is missing required config '{config_key}'.")


class NodeAlreadyDefinedError(ValueError):
    """An exception for adding a node that already exists."""

    def __init__(self, nid: str):
        """Initialize the NodeAlreadyDefinedError."""
        super().__init__(f"Node {nid} already defined.")


class NodeNotFoundError(KeyError):
    """An exception for unknown node."""

    def __init__(self, nid: str):
        """Initialize the NodeNotFoundError."""
        super().__init__(f"Node {nid} not found.")


class OutputAlreadyDefinedError(ValueError):
    """Output already defined error."""

    def __init__(self, name: str):
        """Initialize the OutputAlreadyDefinedError."""
        super().__init__(f"Output '{name}' is already defined.")


class InputNotFoundError(ValueError):
    """An exception for input not defined."""

    def __init__(self, input_name: str):
        """Initialize the InputNotFoundError."""
        super().__init__(f"Input '{input_name}' not found.")


class OutputNotFoundError(ValueError):
    """An exception for output not defined."""

    def __init__(self, output_name: str):
        """Initialize the OutputNotFoundError."""
        super().__init__(f"Output '{output_name}' not found.")


class OutputNamesMissingInTupleOutputModeError(ValueError):
    """An exception for missing output names in tuple output mode."""

    def __init__(self):
        """Initialize the OutputNamesMissingInTupleOutputModeError."""
        super().__init__("Output names are required in tuple output mode.")


class OutputNamesNotValidInValueOutputModeError(ValueError):
    """An exception for output names in value output mode."""

    def __init__(self):
        """Initialize the OutputNamesNotValidInValueOutputModeError."""
        super().__init__("Output names are not allowed in Value output mode")


class VerbNotFoundError(KeyError):
    """An exception for unknown verb."""

    def __init__(self, name: str):
        """Initialize the VerbNotFoundError."""
        super().__init__(f"Unknown verb: {name}")


class VerbAlreadyDefinedError(ValueError):
    """An exception for already defined verb."""

    def __init__(self, name: str):
        """Initialize the VerbAlreadyDefinedError."""
        super().__init__(f"Verb {name} already defined.")


class PortNamesMustBeUniqueError(ValueError):
    """An exception for non-unique port names."""

    def __init__(self):
        """Initialize the PortNamesMustBeUniqueError."""
        super().__init__("Port names must be unique.")
