"""Main configuration module for the essex_config package."""

from functools import cache
from typing import Any, ClassVar, TypeVar

from pydantic import BaseModel
from pydantic_core import PydanticUndefined

from essex_config.configuration_field import ConfigurationField, FieldType
from essex_config.sources import EnvSource, Source

DEFAULT_SOURCE_LIST: list[Source] = [EnvSource()]

T = TypeVar("T", bound="Config")


class Config(BaseModel):
    """Base class for configuration."""

    sources: ClassVar[list[Source]] = DEFAULT_SOURCE_LIST

    @staticmethod
    def __resolve_value(name: str, data: dict[str, Any]):
        if "." in name:
            parts = name.split(".")
            value = data
            for part in parts:
                value = value[part]
            return value

        return data[name]

    @staticmethod
    def __check_name(name: str, data: dict[str, Any]):
        if "." in name:
            parts = name.split(".")
            value = data
            for part in parts:
                if part not in value:
                    return False
                value = value[part]
            return True

        return name in data

    @staticmethod
    @cache
    def __get_data_from_source(source: Source) -> dict[str, Any]:
        return source.get_data()

    @classmethod
    def get_config(cls: type[T], refresh_config: bool = False) -> T:
        """Instantiate the configuration and all values.

        Creates an instance of the Configuration class based on the values of data. If data is None, it will use the environment variables.

        Returns
        -------
            Config: Instance of the configuration class.

        Raises
        ------
            ValueError
                If any of the values is not found.
        """
        if refresh_config:
            cls.__get_data_from_source.cache_clear()

        values = {}
        for name, info in cls.model_fields.items():
            field_info: ConfigurationField = info.metadata[0]
            value = None
            for source in cls.sources:
                data: dict[str, Any] = cls.__get_data_from_source(source)

                if cls.__check_name(name, data):
                    value = cls.__resolve_value(name, data)
                    break
                if field_info.alt_name is not None and cls.__check_name(
                    field_info.alt_name, data
                ):
                    value = cls.__resolve_value(field_info.alt_name, data)
                    break
                if field_info.fallback_names:
                    for fallback_name in field_info.fallback_names:
                        if fallback_name is not None and cls.__check_name(
                            fallback_name, data
                        ):
                            value = cls.__resolve_value(fallback_name, data)
                            break

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
        for name, info in self.model_fields.items():
            if info.metadata[0].field_type == FieldType.SECRET:
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
