"""Main configuration module for the essex_config package."""

from functools import cache
from typing import Any, ClassVar, TypeVar, cast

from pydantic import BaseModel
from pydantic_core import PydanticUndefined

from essex_config.configuration_field import ConfigurationField, FieldVisibility
from essex_config.sources import EnvSource, Source

DEFAULT_SOURCE_LIST: list[Source] = [EnvSource()]

T = TypeVar("T", bound="Config")


class Config(BaseModel):
    """Base class for configuration.

    Classes that inherit from this class will have their fields populated with values from the sources defined in the sources attribute.
    The sources class attribute is a list of `Source` objects that will be used to get the configuration values. The default value is a list with the `EnvSource` object.
    The fields of the class should be annotated with the `Annotated` type from the `typing` module. The first argument of the `Annotated` type should be the type of the field and the second argument should be an instance of the `ConfigurationField` class.

    Examples of usage:

    ```python
    from essex_config.config import (
        Config,
    )
    from essex_config.configuration_field import (
        ConfigurationField,
        FieldVisibility,
    )
    from essex_config.sources.source import (
        Source,
    )

    # Define a class that inherits Config class
    # In this case this class will use the default sources, meaning it will fetch the values from the environment variables
    # In this case the environment was set to:
    # value1=value1
    # value2=2
    # value3=3.0
    # value4=True


    class BasicConfig(
        Config
    ):
        value1: Annotated[
            str,
            ConfigurationField(),
        ]
        value2: Annotated[
            int,
            ConfigurationField(),
        ]
        value3: Annotated[
            Any,
            ConfigurationField(),
        ]
        value4: Annotated[
            bool,
            ConfigurationField(),
        ]


    config = BasicConfig.get_config()

    assert (
        config.value1
        == "value1"
    )
    assert (
        config.value2
        == 2
    )
    assert (
        config.value3
        == 3.0
    )
    assert (
        config.value4
        is True
    )
    ```

    Another example defining a source that will be used to get the values from a yaml file and use a subconfig class as part of a top level configuration class:
    ```python
    from essex_config.config import (
        Config,
    )
    from essex_config.configuration_field import (
        ConfigurationField,
        FieldVisibility,
    )
    from essex_config.sources.source import (
        Source,
    )

    # Define a class that inherits Config class
    # In this case this class will use the default sources, meaning it will fetch the values from the environment variables
    # In this case the yaml file looks like this:

    # TopLevelConfig:
    #  value1: value1
    #  SubConfig:
    #   value2: 2


    class SubConfig(
        Config
    ):
        sources: ClassVar[
            list[Source]
        ] = [
            FileSource(
                "config.yaml"
            )
        ]

        value2: Annotated[
            int,
            ConfigurationField(),
        ]


    class TopLevelConfig(
        Config
    ):
        sources: ClassVar[
            list[Source]
        ] = [
            FileSource(
                "config.yaml"
            )
        ]

        sub_config: (
            SubConfig
        )
        value1: Annotated[
            str,
            ConfigurationField(),
        ]


    config = TopLevelConfig.get_config()
    assert (
        config.value1
        == "value1"
    )
    assert (
        config.sub_config.value2
        == 2
    )
    ```
    """

    sources: ClassVar[list[Source]] = DEFAULT_SOURCE_LIST

    @staticmethod
    def __resolve_value(names: list[str], data: dict[str, Any]) -> Any:
        for name in names:
            if name in data:
                return data[name]

            if "." in name:
                parts = name.split(".")
                value = data
                try:
                    for part in parts:
                        value = value[part]
                except KeyError:
                    continue
                return value

        return None

    @staticmethod
    @cache
    def __get_data_from_source(source: Source) -> dict[str, Any]:
        return source.get_data()

    @classmethod
    def get_config(
        cls: type[T], refresh_config: bool = False, parents: str | None = None
    ) -> T:
        """Instantiate the configuration and all values.

        Creates an instance of the Configuration class based on the values of data. If data is None, it will use the environment variables.

        Parameters
        ----------
            refresh_config : bool, optional
                If True, it will refresh the configuration values, by default False
            parents: str, optional
                The parent class name, used for nested configurations, by default None

        Returns
        -------
            Config: Instance of the configuration class.

        Raises
        ------
            ValueError
                If any of the values is not found.
        """
        parents = cls.__name__ if parents is None else f"{parents}.{cls.__name__}"

        if refresh_config:
            cls.__get_data_from_source.cache_clear()

        values = {}
        for name, info in cls.model_fields.items():
            if issubclass(
                cast(type, info.annotation), Config
            ):  # If the field is a subclass of Config then create an instance and assign it
                sub_config_cls: type[Config] = cast(type[Config], info.annotation)
                values[name] = sub_config_cls.get_config(parents=parents)
                continue

            if len(info.metadata) == 0 or not isinstance(
                info.metadata[0], ConfigurationField
            ):  # If there's a field without ConfigurationField then ignore it
                continue

            field_info: ConfigurationField = info.metadata[0]
            value = None
            for source in cls.sources:
                data: dict[str, Any] = cls.__get_data_from_source(source)

                possible_names = [name]
                if field_info.alt_name is not None:
                    possible_names.append(field_info.alt_name)

                if field_info.fallback_names:
                    possible_names += field_info.fallback_names

                possible_names.extend([
                    f"{parents}.{possible_name}" for possible_name in possible_names
                ])

                possible_names.extend([
                    possible_name.upper().replace(".", "_")
                    for possible_name in possible_names
                ])

                value = cls.__resolve_value(possible_names, data)

            if value is None and info.is_required():
                msg = f"Value for {name} is required and not found in any source."
                raise ValueError(msg)

            if (
                value is None
                and info.default is not None
                and info.default is not PydanticUndefined
            ):
                value = info.default

            if info.annotation is None or info.annotation is Any:
                values[name] = value
            else:
                values[name] = info.annotation(value)

        return cls.model_validate(values)

    def __str__(self) -> str:
        """Return the string representation of the configuration."""
        values = []
        values.append(f"{self.__class__.__name__}:")
        for name, info in self.model_fields.items():
            if issubclass(cast(type, info.annotation), Config):
                values.extend([
                    f"  {line}" for line in getattr(self, name).__str__().split("\n")
                ])
                continue
            if (
                len(info.metadata) > 0
                and info.metadata[0].field_visibility == FieldVisibility.SECRET
            ):
                values.append(f'{name}="********"')
            else:
                if info.annotation is str:
                    values.append(f'{name}="{getattr(self, name)}"')
                else:
                    values.append(f"{name}={getattr(self, name)}")
        return "\n".join(values)

    def __repr__(self) -> str:
        """Return the representation of the configuration."""
        return self.__str__()

    def __rich__(self) -> str:
        """Return the rich representation of the configuration."""
        return self.__str__()
