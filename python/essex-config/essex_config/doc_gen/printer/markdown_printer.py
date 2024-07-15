"""Printer to print the configuration using markdown file."""

from pathlib import Path

from pydantic_core import PydanticUndefined

from essex_config import Config
from essex_config.doc_gen.printer.printer import ConfigurationPrinter


class MarkdownConfigurationPrinter(ConfigurationPrinter):
    """Printer to print the configuration using markdown."""

    def __init__(self, file_path: Path) -> None:
        self.file_path = file_path

    def print(self, config_class: type[Config]) -> None:
        """Print the configuration."""
        with self.file_path.open("a") as file:
            file.write(f"# {config_class.__name__}\n\n")
            file.write(f"{config_class.__doc__}\n\n")
            file.write("## Sources\n\n")
            file.write("\n".join([f"* {source}\n" for source in config_class.sources]))

            file.write("## Parameters\n\n")

            for name, info in config_class.model_fields.items():
                default = info.default if info.default is not PydanticUndefined else ""
                description = info.metadata[0].description
                if info.metadata[0].alt_name is not None:
                    description += f"\n\tAlternative name: {info.metadata[0].alt_name}"
                if info.metadata[0].fallback_names:
                    description += f"\n\tFallback names: {', '.join(info.metadata[0].fallback_names)}"
                file.write(
                    f"### {name}: {info.annotation.__name__ if info.annotation is not None else 'Any'}\n"
                )
                file.write(f"Description: {description}\n")
                file.write(f"Required: {info.is_required()!s}\n")
                file.write(f"Default: {default!s}\n\n")
