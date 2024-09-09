"""Main configuration module for the essex_config package."""

import os
from functools import cache
from types import UnionType
from typing import (
    Any,
    TypeVar,
    Union,
    cast,
    get_args,
    get_origin,
)

from pydantic import BaseModel
from pydantic_core import PydanticUndefined

from essex_config.field_annotations import (
    Alias,
    Parser,
    Prefixed,
    Updatable,
    get_annotation,
)
from essex_config.sources import EnvSource, Source
from essex_config.utils import parse_string_template

from .utils import is_pydantic_model

DEFAULT_SOURCE_LIST: list[Source] = [EnvSource()]


T = TypeVar("T", bound=BaseModel)


def load_config(
    cls: type[T],
    *,
    sources: list[Source] = DEFAULT_SOURCE_LIST,
    prefix: str = "",
    inner: bool = False,
    refresh_config: bool = False,
    parse_env_values: bool = False,
) -> T:
    """Instantiate the configuration and all values.

    Parameters
    ----------
        sources: tuple[Source], optional
            A tuple of sources to use to get the values.
        prefix: str, optional
            The prefix name to use to look for the values in the sources, by default ""
        refresh_config: bool, optional
            If True, the cache is cleared before loading the configuration.

    Returns
    -------
        T: Instance of the configuration class.

    Raises
    ------
        ValueError
            If any of the values is not found.
    """
    if refresh_config:
        _load_config.cache_clear()
    return _load_config(cls, tuple(sources), prefix, inner, parse_env_values)


@cache
def _load_config(
    cls: type[T],
    sources: tuple[Source, ...],
    prefix: str = "",
    inner: bool = False,
    parse_env_values: bool = False,
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

        prefix_annotation = get_annotation(Prefixed, info)
        parser_annotation = get_annotation(Parser, info)
        update_annotation = get_annotation(Updatable, info)

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
                if is_pydantic_model(type_):
                    if prefix_annotation is None:
                        field_prefix += f".{name}" if field_prefix != "" else name
                    try:
                        values[name] = _load_config(
                            type_,
                            sources,
                            prefix=field_prefix,
                            inner=True,
                            parse_env_values=parse_env_values,
                        )
                    except Exception:  # noqa: S112, BLE001
                        continue
                    else:
                        break
            if name in values and values[name] is not None:
                continue
        elif is_pydantic_model(field_type):
            if prefix_annotation is None:
                field_prefix += f".{name}" if field_prefix != "" else name
            values[name] = _load_config(
                field_type,
                sources,
                prefix=field_prefix,
                inner=True,
                parse_env_values=parse_env_values,
            )
            continue

        env_values: dict[str, Any] = {}
        for source in filter(lambda src: isinstance(src, EnvSource), sources):
            source = cast(EnvSource, source)
            env_values = {**source.get_data(), **env_values}

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
                if value and update_annotation:
                    _value = source.get_value(
                        name,
                        field_type,
                        field_prefix,
                        source_alias.get(type(source)),
                        parser_annotation,
                    )
                    value = update_annotation.update(value, _value)
                else:
                    value = source.get_value(
                        name,
                        field_type,
                        field_prefix,
                        source_alias.get(type(source)),
                        parser_annotation,
                    )

                if update_annotation is None:
                    break
            except KeyError:
                continue

        if value is None and info.default is not PydanticUndefined:
            value = info.default
        if value is None and info.default_factory is not None:
            value = info.default_factory()

        if parse_env_values:
            value = parse_string_template(value, {**os.environ, **env_values})

        if (value is None or value is PydanticUndefined) and info.is_required():
            msg = f"Value for {name} is required and not found in any source."
            raise ValueError(msg)

        values[name] = value

    return cls.model_validate(values)
