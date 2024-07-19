"""Printer to print the configuration using rich."""

from typing import cast

from pydantic_core import PydanticUndefined
from rich import box, print
from rich.console import Group
from rich.panel import Panel
from rich.table import Table

from essex_config import Config
from essex_config.doc_gen.printer.printer import ConfigurationPrinter


class RichConfigurationPrinter(ConfigurationPrinter):
    """Printer to print the configuration using rich."""

    def print(self, config_class: type[Config]) -> None:
        """Print the configuration."""
        docs = f"Description: {config_class.__doc__}\n\nConfig is read from the following sources:\n"
        docs += "\n".join([f"\t- {source}" for source in config_class.__sources__])
        params = Table(
            title="Parameters", show_header=True, expand=True, leading=2, box=box.SIMPLE
        )
        params.add_column("Name")
        params.add_column("Description")
        params.add_column("Required?")
        params.add_column("Default")

        for name, info in config_class.model_fields.items():
            default = info.default if info.default is not PydanticUndefined else ""
            if issubclass(cast(type, info.annotation), Config):
                params.add_row(
                    f"{name}: {cast(type, info.annotation).__name__}",
                    f"See {cast(type, info.annotation).__name__} for more details",
                    str(info.is_required()),
                    str(default),
                )
                continue
            if len(info.metadata) == 0:
                continue

            description = (
                info.metadata[0].description if info.metadata[0].description else ""
            )
            if info.metadata[0].alias is not None:
                description += f"\nAlternative name: {info.metadata[0].alias}"
            if info.metadata[0].fallback_names:
                description += (
                    f"\nFallback names: {', '.join(info.metadata[0].fallback_names)}"
                )
            params.add_row(
                f"{name}: {info.annotation.__name__ if info.annotation is not None else 'Any'}",
                description,
                str(info.is_required()),
                str(default),
            )

        panel = Panel(
            Group(docs, params),
            title=config_class.__name__,
            border_style="green",
        )
        print(panel)
