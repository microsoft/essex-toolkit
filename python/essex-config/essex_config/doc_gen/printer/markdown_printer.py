"""Printer to print the configuration using rich."""

from pathlib import Path
from typing import cast

from pydantic import BaseModel
from pydantic_core import PydanticUndefined

from essex_config.config import Prefixed
from essex_config.doc_gen.printer.printer import ConfigurationPrinter
from essex_config.sources.source import Alias


class MarkdownConfigurationPrinter(ConfigurationPrinter):
    """Printer to print the configuration using rich."""

    def __init__(self, file_path: Path) -> None:
        self.file_path = file_path

    def _get_markdown(
        self,
        config_class: type[BaseModel],
        disable_nested: bool,
        prefixed: str = "",
        override_name: str = "",
    ) -> str:
        docs = config_class.__doc__ if config_class.__doc__ is not None else ""

        docs += "\n# Parameters:\n"

        params = "|Name|Description|Alias|Prefix|Required?|Default|\n"
        new_row = "|---|---|---|---|---|---|\n"

        params += new_row

        for name, info in config_class.model_fields.items():
            default = info.default if info.default is not PydanticUndefined else ""
            field_type = cast(type, info.annotation)
            source_alias: str = "<br>".join([
                f"{metadata.source.__name__}: {metadata.alias}"
                for metadata in info.metadata
                if isinstance(metadata, Alias)
            ])

            prefix_annotation = next(
                (
                    metadata
                    for metadata in info.metadata
                    if isinstance(metadata, Prefixed)
                ),
                None,
            )
            if prefixed != "":
                prefix = (
                    f"{prefixed}.{prefix_annotation.prefix}"
                    if prefix_annotation is not None
                    else prefixed
                )
            else:
                prefix = (
                    prefix_annotation.prefix if prefix_annotation is not None else ""
                )

            if issubclass(field_type, BaseModel):
                subclass_description = (
                    f"See {name}: {field_type.__name__} for more details."
                    if not disable_nested
                    else field_type.__doc__.replace("\n", "<br>")
                    if field_type.__doc__ is not None
                    else ""
                )
                subclass_line = f"|{name}: {field_type.__name__}|{subclass_description}|{source_alias}|{prefix}|{info.is_required()!s}||\n"
                params += subclass_line
                continue

            params += f"|{name}: {info.annotation.__name__ if info.annotation is not None else 'Any'}|{info.description if info.description is not None else ''}|{source_alias}|{prefix}|{info.is_required()!s}|{default!s}|\n"

        title = config_class.__name__ if override_name == "" else override_name

        return f"# {title}\n" + (docs + "\n" + params).replace("#", "##") + "\n"

    def print(self, config_class: type[BaseModel], disable_nested: bool) -> None:
        """Print the configuration."""
        with self.file_path.open("a") as file:
            class_docs = self._get_markdown(config_class, disable_nested)
            file.write(class_docs)
            if not disable_nested:
                for name, info in config_class.model_fields.items():
                    prefix_annotation = next(
                        (
                            metadata
                            for metadata in info.metadata
                            if isinstance(metadata, Prefixed)
                        ),
                        None,
                    )
                    if info.annotation is not None and issubclass(
                        cast(type, info.annotation), BaseModel
                    ):
                        prefix = (
                            f"{prefix_annotation.prefix}"
                            if prefix_annotation is not None
                            else name
                        )
                        subclass_docs = self._get_markdown(
                            cast(type[BaseModel], info.annotation),
                            disable_nested,
                            prefix,
                            override_name=f"{name}: {info.annotation.__name__}",
                        )
                        file.write(subclass_docs)
