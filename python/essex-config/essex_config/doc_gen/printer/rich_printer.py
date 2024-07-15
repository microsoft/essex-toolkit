"""Printer to print the configuration using rich."""

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
        docs += "\n".join([f"\t- {source}" for source in config_class.sources])
        params = Table(
            title="Parameters", show_header=True, expand=True, leading=2, box=box.SIMPLE
        )
        params.add_column("Name")
        params.add_column("Description")
        params.add_column("Required?")
        params.add_column("Default")

        for name, info in config_class.model_fields.items():
            default = info.default if info.default is not PydanticUndefined else ""
            description = info.metadata[0].description
            if info.metadata[0].alt_name is not None:
                description += f"\n\tAlternative name: {info.metadata[0].alt_name}"
            if info.metadata[0].fallback_names:
                description += (
                    f"\n\tFallback names: {', '.join(info.metadata[0].fallback_names)}"
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
