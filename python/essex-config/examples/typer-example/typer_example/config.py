"""Configuration Module."""

from typing import Annotated, ClassVar

from essex_config import Config
from essex_config.configuration_field import ConfigurationField
from essex_config.sources import EnvSource, FileSource, Source


class ExampleSubSubConfig(Config):
    """Example of a sub-sub configuration class."""

    sources: ClassVar[list[Source]] = [
        EnvSource(),
        FileSource("FILE_CONFIG", use_env_var=True),
    ]

    sub_sub_config_value: Annotated[str, ConfigurationField()] = "default_value"


class ExampleSubConfig(Config):
    """Example of a sub configuration class."""

    sources: ClassVar[list[Source]] = [
        EnvSource(),
        FileSource("FILE_CONFIG", use_env_var=True),
    ]

    sub_config_value: Annotated[str, ConfigurationField()]
    another_sub_config_value: Annotated[
        int, ConfigurationField(alt_name="sub_config_alt_name")
    ]
    sub_sub_config: ExampleSubSubConfig


class ExampleConfig(Config):
    """Example of a configuration class that uses sub configurations."""

    sources: ClassVar[list[Source]] = [
        EnvSource(),
        FileSource("FILE_CONFIG", use_env_var=True),
    ]

    config_value: Annotated[str, ConfigurationField()]
    another_config_value: Annotated[
        float, ConfigurationField(fallback_names=["fallbacks.another_config_value"])
    ]
    sub_config: ExampleSubConfig
