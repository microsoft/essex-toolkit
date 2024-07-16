"""Test configuration for the essex-config package."""

from typing import Annotated, Any, ClassVar

import pytest

from essex_config.config import Config
from essex_config.configuration_field import ConfigurationField, FieldType
from essex_config.sources.source import Source


class MockSource(Source):
    def __init__(self):
        self.data = {
            "value1": "value1",
            "value2": 2,
            "value3": 3.0,
            "value4": True,
            "secret": "password",
            "deep": {"value5": "value5"},
        }

    def get_data(self) -> dict[str, Any]:
        return self.data


def test_basic_configuration():
    class BasicConfig(Config):
        sources: ClassVar[list[Source]] = [MockSource()]

        value1: Annotated[str, ConfigurationField()]
        value2: Annotated[int, ConfigurationField()]
        value3: Annotated[Any, ConfigurationField()]
        value4: Annotated[bool, ConfigurationField()]

    config = BasicConfig.get_config()
    assert config.value1 == "value1"
    assert config.value2 == 2
    assert config.value3 == 3.0
    assert config.value4 is True


def test_missing_config_value():
    class MissingValueConfig(Config):
        sources: ClassVar[list[Source]] = [MockSource()]

        value5: Annotated[str, ConfigurationField()]

    with pytest.raises(
        ValueError, match="Value for value5 is required and not found in any source."
    ):
        MissingValueConfig.get_config()


def test_redacted_secret():
    class Secret(Config):
        sources: ClassVar[list[Source]] = [MockSource()]

        value1: Annotated[str, ConfigurationField()]
        value2: Annotated[int, ConfigurationField()]
        secret: Annotated[str, ConfigurationField(field_type=FieldType.SECRET)]

    config = Secret.get_config()

    assert config.secret == "password"
    assert "password" not in str(Secret.get_config())
    assert "password" not in repr(Secret.get_config())
    assert "password" not in config.__rich__()


def test_dot_notation_alt_name():
    class AltNameConfig(Config):
        sources: ClassVar[list[Source]] = [MockSource()]

        value: Annotated[str, ConfigurationField(alt_name="deep.value5")]

    config = AltNameConfig.get_config()
    assert config.value == "value5"


def test_fallback_names():
    class FallbackConfig(Config):
        sources: ClassVar[list[Source]] = [MockSource()]

        value: Annotated[
            str,
            ConfigurationField(fallback_names=["value10", "value11", "deep.value5"]),
        ]

    config = FallbackConfig.get_config()
    assert config.value == "value5"


def test_default():
    class DefaultValueConfig(Config):
        sources: ClassVar[list[Source]] = [MockSource()]

        value: Annotated[
            str,
            ConfigurationField(
                alt_name="hello.world",
                fallback_names=["value10", "value11", "bye.world"],
            ),
        ] = "default_value"

    config = DefaultValueConfig.get_config()
    assert config.value == "default_value"


def test_refresh():
    mock_source = MockSource()

    class DefaultValueConfig(Config):
        sources: ClassVar[list[Source]] = [mock_source]

        value: Annotated[
            str,
            ConfigurationField(
                alt_name="hello.world",
                fallback_names=["value10", "value11", "bye.world"],
            ),
        ] = "default_value"

    config = DefaultValueConfig.get_config()
    assert config.value == "default_value"

    mock_source.data = {"hello": {"world": "new_value"}}

    config = DefaultValueConfig.get_config()  # get_config should have cached values
    assert config.value == "default_value"

    config = DefaultValueConfig.get_config(
        refresh_config=True
    )  # refresh_config should refresh the values
    assert config.value == "new_value"
