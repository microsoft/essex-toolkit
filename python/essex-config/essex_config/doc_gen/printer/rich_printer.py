"""Printer to print the configuration using rich."""

from typing import cast

from pydantic import BaseModel
from pydantic_core import PydanticUndefined
from rich import box, print
from rich.console import Group
from rich.markdown import Markdown
from rich.panel import Panel
from rich.table import Table

from essex_config.config import Prefixed
from essex_config.doc_gen.printer.printer import ConfigurationPrinter
from essex_config.sources.source import Alias


class RichConfigurationPrinter(ConfigurationPrinter):
    """Printer to print the configuration using rich."""

    def _get_config_panel(
        self,
        config_class: type[BaseModel],
        disable_nested: bool,
        prefixed: str = "",
        override_name: str = "",
    ) -> Panel:
        docs = config_class.__doc__
        params = Table(
            title="Parameters", show_header=True, expand=True, leading=2, box=box.ASCII
        )
        params.add_column("Name")
        params.add_column("Description")
        params.add_column("Alias")
        params.add_column("Prefix")
        params.add_column("Required?")
        params.add_column("Default")

        for name, info in config_class.model_fields.items():
            default = info.default if info.default is not PydanticUndefined else ""
            field_type = cast(type, info.annotation)
            source_alias: str = "\n".join([
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
                params.add_row(
                    f"{name}: {field_type.__name__}",
                    f"See {name}: {field_type.__name__} for more details."
                    if not disable_nested
                    else field_type.__doc__,
                    source_alias,
                    prefix,
                    str(info.is_required()),
                    "",
                )
                continue

            params.add_row(
                f"{name}: {info.annotation.__name__ if info.annotation is not None else 'Any'}",
                info.description if info.description is not None else "",
                source_alias,
                prefix,
                str(info.is_required()),
                str(default),
            )

        return Panel(
            Group(Markdown(docs if docs else ""), params),
            title=config_class.__name__ if override_name == "" else override_name,
            border_style="green",
        )

    def print(self, config_class: type[BaseModel], disable_nested: bool) -> None:
        """Print the configuration."""
        print(self._get_config_panel(config_class, disable_nested))
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
                    print(
                        self._get_config_panel(
                            cast(type[BaseModel], info.annotation),
                            disable_nested,
                            prefix,
                            override_name=f"{name}: {info.annotation.__name__}",
                        )
                    )
