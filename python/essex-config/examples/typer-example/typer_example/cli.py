"""Example typer cli application using essex-config."""

import os
from typing import Annotated

import typer

from .config import ExampleConfig

app = typer.Typer()


@app.command()
def load(config_file: Annotated[str, typer.Argument(help="Configuration file path")]):
    """Load the configuration and print it."""
    typer.echo(
        "Example typer application loading a configuration file using essex-config"
    )

    os.environ["FILE_CONFIG"] = config_file

    config = ExampleConfig.get_config()
    typer.echo("--------------------")
    print(config)  # noqa: T201
    typer.echo("--------------------")

    typer.echo("Access of individual values: ")
    typer.echo(f"config_value: {config.config_value}")
    typer.echo(f"another_config_value: {config.another_config_value}")
    typer.echo(f"sub_config_value: {config.sub_config.sub_config_value}")
    typer.echo(
        f"another_sub_config_value: {config.sub_config.another_sub_config_value}"
    )
    typer.echo(
        f"sub_sub_config_value: {config.sub_config.sub_sub_config.sub_sub_config_value}"
    )
