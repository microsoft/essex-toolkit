# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow Verb Registry."""

from collections.abc import Callable
from typing import ClassVar

from reactivedataflow.errors import VerbAlreadyRegisteredError, VerbNotFoundError
from reactivedataflow.nodes import (
    VerbFunction,
)

from .registration import Registration
from .verb_constructor import verb_constructor

VerbConstructor = Callable[[Registration], VerbFunction]


class Registry:
    """A registry for verbs."""

    _instance: ClassVar["Registry | None"] = None
    _verbs: dict[str, Registration]
    _verb_fns: dict[str, VerbFunction]
    _verb_constructor: VerbConstructor

    def __init__(self, _verb_constructor: VerbConstructor = verb_constructor):
        self._verbs = {}
        self._verb_fns = {}
        self._verb_constructor = _verb_constructor

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

    def get_verb_function(self, name: str) -> VerbFunction:
        """Get a built verb function."""
        if self._verb_fns.get(name) is None:
            registration = self.get(name)
            verb_fn = self._verb_constructor(registration)
            self._verb_fns[name] = verb_fn
        return self._verb_fns[name]

    @staticmethod
    def get_instance() -> "Registry":
        """Get the singleton instance of the registry."""
        if Registry._instance is None:
            Registry._instance = Registry()
        return Registry._instance
