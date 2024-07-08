# Copyright (c) 2024 Microsoft Corporation.
"""reactivedataflow ConfigProvider Protocol."""

from typing import Generic, Protocol, TypeVar

T = TypeVar("T", covariant=True)


class ConfigProvider(Protocol, Generic[T]):
    """A protocol for providing configuration values.

    ConfigProviders are evaluated lazily, as they have no way of triggering an ExecutionNode update.
    When an ExecutionNode receives an update signal, it will invoke the ConfigProvider.get method to get the latest value of the configuration to assemble a VerbInput.
    """

    def get(self) -> T:
        """Get the configuration value for the given name."""
        ...
