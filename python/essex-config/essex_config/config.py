"""Main configuration module for the essex_config package."""

import inspect
from collections.abc import Callable
from functools import cache
from types import UnionType
from typing import (
    Protocol,
    TypeVar,
    Union,
    cast,
    get_args,
    get_origin,
    runtime_checkable,
)

from pydantic import BaseModel
from pydantic_core import PydanticUndefined

from essex_config.field_decorators import Alias, Parser, Prefixed
from essex_config.sources import EnvSource, Source

DEFAULT_SOURCE_LIST: list[Source] = [EnvSource()]


T = TypeVar("T", bound=BaseModel)
V = TypeVar("V", bound=BaseModel, covariant=True)


@runtime_checkable
class Config(Protocol[V]):
    """Protocol to define the configuration class."""

    @classmethod
    def load_config(
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
    inner: bool = False,
) -> T:
    """Instantiate the configuration and all values.

    Parameters
    ----------
        sources: tuple[Source], optional
            A tuple of sources to use to get the values.
        prefix: str, optional
            The prefix name to use to look for the values in the sources, by default ""

    Returns
    -------
        T: Instance of the configuration class.

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

        parser_annotation = next(
            (metadata for metadata in info.metadata if isinstance(metadata, Parser)),
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

        origin = get_origin(field_type)
        if origin is Union or origin is UnionType:
            types = get_args(field_type)
            for type_ in types:
                if inspect.isclass(type_) and issubclass(type_, BaseModel):
                    if prefix_annotation is None:
                        field_prefix += f".{name}" if field_prefix != "" else name
                    try:
                        values[name] = load_config(
                            type_, sources, prefix=field_prefix, inner=True
                        )
                    except Exception:  # noqa: S112, BLE001
                        continue
                    else:
                        break
            if name in values and values[name] is not None:
                continue
        elif inspect.isclass(field_type) and issubclass(field_type, BaseModel):
            if prefix_annotation is None:
                field_prefix += f".{name}" if field_prefix != "" else name
            values[name] = load_config(
                field_type, sources, prefix=field_prefix, inner=True
            )
            continue

        value = None
        for source in sources:
            if (
                source.prefix is not None
                and prefix_annotation is not None
                and field_prefix == prefix_annotation.prefix
            ) or (source.prefix is not None and inner):
                # Add the source prefix to the prefix annotated field
                field_prefix = f"{source.prefix}.{field_prefix}"
            elif source.prefix is not None and field_prefix != "":
                # Replace the root prefix with the source prefix
                without_root_prefix = ".".join(field_prefix.split(".")[1:])
                field_prefix = (
                    f"{source.prefix}.{without_root_prefix}"
                    if without_root_prefix != ""
                    else source.prefix
                )
            elif source.prefix is not None and field_prefix == "":
                # Use the source prefix as the field prefix
                field_prefix = source.prefix
            try:
                value = source.get_value(
                    name,
                    field_type,
                    field_prefix,
                    source_alias.get(type(source)),
                    parser_annotation,
                )
                break
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


def _add_docs(cls: type[Config], sources: list[Source], prefix: str):
    if cls.__doc__ is None:
        cls.__doc__ = ""

    new_docs = f"*Configuration Prefix: {prefix}*\n\n" if prefix != "" else ""
    new_docs += "\n\n".join([
        line.strip() for line in cls.__doc__.split("\n") if line.strip() != ""
    ])

    doc_sources = "\n".join([f"* {source!s}" for source in sources])
    new_docs += f"\n\n# Sources:\n\n{doc_sources}\n"

    cls.__doc__ = new_docs


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
            else:
                sources.extend(_sources)
            if prefix is None:
                prefix = _prefix

            return load_config(cls, tuple(sources), prefix)  # type: ignore

        protocol_cls = cast(type[Config[T]], cls)
        protocol_cls.load_config = classmethod(load)  # type: ignore

        _add_docs(protocol_cls, _sources, _prefix)

        return protocol_cls

    return wrapper
