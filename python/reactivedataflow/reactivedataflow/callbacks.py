# Copyright (c) 2024 Microsoft Corporation.
"""The ExecutionGraphCallbacks protocol."""

from typing import Protocol


class Callbacks(Protocol):
    """The callbacks for the execution graph."""

    def on_verb_start(self, node_id: str, verb: str) -> None:
        """Event handler for when a verb starts executing."""
        ...

    def on_verb_finish(self, node_id: str, verb: str, duration: float) -> None:
        """Event handler for when a verb finishes executing."""
        ...
