"""Main CLI module for the document generation essex_config package."""

import argparse
from pathlib import Path

from essex_config.doc_gen import generate_docs
from essex_config.doc_gen.printer import (
    MarkdownConfigurationPrinter,
    RichConfigurationPrinter,
)
from essex_config.doc_gen.printer.printer import ConfigurationPrinter

if __name__ == "__main__":
    parser: argparse.ArgumentParser = argparse.ArgumentParser(
        description="Generate documentation for all configuration classes in the project."
    )
    parser.add_argument(
        "package", help="Package name to search for configuration classes."
    )
    parser.add_argument(
        "classes", help="Classes to generate documentation for.", nargs="+"
    )
    parser.add_argument(
        "--disable_nested",
        help="Disable showing nested configuration objects.",
        action="store_true",
    )
    parser.add_argument(
        "--output", help="Output file to save the documentation.", default=None
    )

    args: argparse.Namespace = parser.parse_args()

    output_file: Path | None = Path(args.output) if args.output is not None else None

    if output_file is not None:
        output_file.unlink(missing_ok=True)
        printer: ConfigurationPrinter = MarkdownConfigurationPrinter(output_file)
    else:
        printer: ConfigurationPrinter = RichConfigurationPrinter()

    generate_docs(args.package, printer, args.classes, args.disable_nested)
