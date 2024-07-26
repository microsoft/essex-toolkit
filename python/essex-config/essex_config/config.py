"""Main configuration module for the essex_config package."""

from collections.abc import Callable
from dataclasses import dataclass
from functools import cache
from typing import Protocol, TypeVar, cast

from pydantic import BaseModel
from pydantic_core import PydanticUndefined

from essex_config.sources import EnvSource, Source
from essex_config.sources.source import Alias

DEFAULT_SOURCE_LIST: list[Source] = [EnvSource()]


T = TypeVar("T", bound=BaseModel)
V = TypeVar("V", covariant=True)


@dataclass
class Prefixed:
    """Class to define the prefix for the configuration."""

    prefix: str


class Config(Protocol[V]):
    """Protocol to define the configuration class."""

    @classmethod
    def config_load(
        cls: type,
        sources: list[Source] | None = None,
        *,
        prefix: str | None = None,
        refresh_config: bool = False,
    ) -> V:  # pragma: no cover
        """Load the configuration values."""
        ...


@cache
def load_config(
    cls: type[T],
    sources: tuple[Source, ...],
    prefix: str = "",
) -> T:
    """Instantiate the configuration and all values.

    Creates an instance of the Configuration class based on the values of data. If data is None, it will use the environment variables.

    Parameters
    ----------
        parents: str, optional
            The parent class name, used for nested configurations, by default None
        sources: list[Source], optional
            A list of Source objects to be used to get the configuration values (overrides the __sources__ classvar),
            If None is provided then the default list will be used, by default None

    Returns
    -------
        Config: Instance of the configuration class.

    Raises
    ------
        ValueError
            If any of the values is not found.
    """
    values = {}
    for name, info in cls.model_fields.items():
        field_type = cast(type, info.annotation)

        source_alias: dict[type, Alias] = {
            metadata.source: metadata
            for metadata in info.metadata
            if isinstance(metadata, Alias)
        }

        prefix_annotation = next(
            (metadata for metadata in info.metadata if isinstance(metadata, Prefixed)),
            None,
        )

        if prefix_annotation is not None:
            field_prefix = (
                f"{prefix}.{prefix_annotation.prefix}"
                if prefix != ""
                else prefix_annotation.prefix
            )
        else:
            field_prefix = prefix

        if issubclass(field_type, BaseModel):
            if prefix_annotation is None:
                field_prefix += f".{name}" if field_prefix != "" else name
            values[name] = load_config(field_type, sources, prefix=field_prefix)
            continue

        value = None
        for source in sources:
            try:
                value = source.get_value(
                    name, field_type, field_prefix, source_alias.get(type(source))
                )
            except KeyError:
                continue

        if value is None and info.default is not PydanticUndefined:
            value = info.default
        if value is None and info.default_factory is not None:
            value = info.default_factory()

        if (value is None or value is PydanticUndefined) and info.is_required():
            msg = f"Value for {name} is required and not found in any source."
            raise ValueError(msg)

        values[name] = value

    return cls.model_validate(values)


def config(
    *, sources: list[Source] = DEFAULT_SOURCE_LIST, prefix: str = ""
) -> Callable[[type[T]], type[Config[T]]]:
    """Add configuration loading capabilities to BaseModel pydantic class."""

    def wrapper(cls: type[T]) -> type[Config[T]]:
        _sources = sources
        _prefix = prefix

        def load(
            cls: type[T],
            sources: list[Source] | None = None,
            *,
            prefix: str | None = None,
            refresh_config: bool = False,
        ) -> T:
            if refresh_config:
                load_config.cache_clear()
            if sources is None:
                sources = _sources
            if prefix is None:
                prefix = _prefix

            return load_config(cls, tuple(sources), prefix)  # type: ignore

        protocol_cls = cast(type[Config[T]], cls)
        protocol_cls.config_load = classmethod(load)  # type: ignore
        return protocol_cls

    return wrapper
