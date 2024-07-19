"""Test configuration for the essex-config package."""

import re
from typing import Annotated, ClassVar

import pytest
from pydantic import Field

from essex_config.config import Config
from essex_config.configuration_field import ConfigurationField, FieldVisibility
from essex_config.sources.convert_utils import convert_to_type
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

    def get_value(self, key, value_type):
        data = self.data
        if "." in key:
            parts = key.split(".")
            value = data
            try:
                for part in parts:
                    value = value[part]
            except KeyError as e:
                msg = f"Key {key} not found in the file."
                raise KeyError(msg) from e
            return convert_to_type(value, value_type)
        if key not in data:
            msg = f"Key {key} not found in the file."
            raise KeyError(msg)
        return convert_to_type(data[key], value_type)

    def __contains__(self, key: str) -> bool:
        """Check if the key is present in the file."""
        data = self.data

        if "." in key:
            parts = key.split(".")
            value = data
            try:
                for part in parts:
                    value = value[part]
            except KeyError:
                return False
            return True

        return key in data


def test_basic_configuration():
    class BasicConfig(Config):
        __sources__: ClassVar[list[Source]] = [MockSource()]

        value1: str
        value2: int
        value3: float
        value4: bool
        value5: Annotated[str, ConfigurationField(description="value from Field()")] = (
            Field(default_factory=lambda: "default5")
        )

    config = BasicConfig.get_config()
    assert config.value1 == "value1"
    assert config.value2 == 2
    assert config.value3 == 3.0
    assert config.value4 is True
    assert config.value5 == "default5"


def test_wrong_type():
    class BasicConfig(Config):
        __sources__: ClassVar[list[Source]] = [MockSource()]

        value1: int

    with pytest.raises(
        ValueError, match=re.escape("Cannot convert [value1] to type [<class 'int'>].")
    ):
        BasicConfig.get_config()


def test_missing_config_value():
    class MissingValueConfig(Config):
        __sources__: ClassVar[list[Source]] = [MockSource()]

        value5: Annotated[str, ConfigurationField()]

    with pytest.raises(
        ValueError, match="Value for value5 is required and not found in any source."
    ):
        MissingValueConfig.get_config()


def test_redacted_secret():
    class Secret(Config):
        __sources__: ClassVar[list[Source]] = [MockSource()]

        value1: Annotated[str, ConfigurationField()]
        value2: Annotated[int, ConfigurationField()]
        secret: Annotated[
            str, ConfigurationField(field_visibility=FieldVisibility.SECRET)
        ]

    config = Secret.get_config()

    assert config.secret == "password"
    assert "password" not in str(Secret.get_config())
    assert "password" not in repr(Secret.get_config())
    assert "password" not in config.__rich__()


def test_dot_notation_alias():
    class AltNameConfig(Config):
        __sources__: ClassVar[list[Source]] = [MockSource()]

        value: Annotated[str, ConfigurationField(alias="deep.value5")]

    config = AltNameConfig.get_config()
    assert config.value == "value5"


def test_fallback_names():
    class FallbackConfig(Config):
        __sources__: ClassVar[list[Source]] = [MockSource()]

        value: Annotated[
            str,
            ConfigurationField(fallback_names=["value10", "value11", "deep.value5"]),
        ]

    config = FallbackConfig.get_config()
    assert config.value == "value5"


def test_default():
    class DefaultValueConfig(Config):
        __sources__: ClassVar[list[Source]] = [MockSource()]

        value: Annotated[
            str,
            ConfigurationField(
                alias="hello.world",
                fallback_names=["value10", "value11", "bye.world"],
            ),
        ] = "default_value"

    config = DefaultValueConfig.get_config()
    assert config.value == "default_value"


def test_sub_config():
    class SubConfig(Config):
        __sources__: ClassVar[list[Source]] = [MockSource()]
        value4: Annotated[bool, ConfigurationField()]

    class TopLevelConfig(Config):
        __sources__: ClassVar[list[Source]] = [MockSource()]

        sub_config: SubConfig
        value1: Annotated[str, ConfigurationField()]

    config = TopLevelConfig.get_config()

    assert config.value1 == "value1"
    assert config.sub_config.value4 is True


def test_hierarchy():
    source = MockSource()

    source.data = {
        "TopLevelConfig": {
            "value1": "value1",
            "SubConfig": {"value4": True},
        }
    }

    class SubConfig(Config):
        __sources__: ClassVar[list[Source]] = [source]

        value4: Annotated[bool, ConfigurationField()]

    class TopLevelConfig(Config):
        __sources__: ClassVar[list[Source]] = [source]

        sub_config: SubConfig
        value1: Annotated[str, ConfigurationField()]
        ignored_field: str = "ignored"

    config = TopLevelConfig.get_config()

    assert config.value1 == "value1"
    assert config.sub_config.value4 is True
    assert config.ignored_field == "ignored"

    assert "SubConfig" in str(config)


def test_refresh():
    mock_source = MockSource()

    class DefaultValueConfig(Config):
        __sources__: ClassVar[list[Source]] = [mock_source]

        value: Annotated[
            str,
            ConfigurationField(
                alias="hello.world",
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
