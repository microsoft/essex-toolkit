# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Verb Registry."""

from dataclasses import dataclass
from typing import ClassVar

from reactivedataflow.errors import VerbAlreadyRegisteredError, VerbNotFoundError

from .nodes import VerbFunction
from .ports import Ports


@dataclass
class Registration:
    """Registration of an verb function."""

    fn: VerbFunction
    """The verb function."""

    ports: Ports
    """The ports of the verb function."""


class Registry:
    """A registry for verbs."""

    _instance: ClassVar["Registry | None"] = None
    _verbs: dict[str, Registration]

    def __init__(self):
        self._verbs = {}

    def register(
        self,
        name: str,
        registration: Registration,
        override: bool | None = None,
    ) -> None:
        """Register a verb."""
        if name in self._verbs and not override:
            raise VerbAlreadyRegisteredError(name)
        self._verbs[name] = registration

    def get(self, name: str) -> Registration:
        """Get a verb by name."""
        result = self._verbs.get(name)
        if result is None:
            raise VerbNotFoundError(name)
        return result

    @staticmethod
    def get_instance() -> "Registry":
        """Get the singleton instance of the registry."""
        if Registry._instance is None:
            Registry._instance = Registry()
        return Registry._instance
