"""Script to generate the documentation of all configurations in the project."""

import importlib
import inspect
import pkgutil

from pydantic import BaseModel

from essex_config.doc_gen.printer import ConfigurationPrinter


def __find_subclasses(package_name: str) -> list[type]:
    package = importlib.import_module(package_name)
    subclasses: list[type] = []

    # Iterate through all modules in the package
    for _, module_name, _ in pkgutil.walk_packages(
        package.__path__, package.__name__ + "."
    ):
        module = importlib.import_module(module_name)

        # Iterate through all members of the module
        for _, obj in inspect.getmembers(module):
            if inspect.isclass(obj) and issubclass(obj, BaseModel):
                subclasses.append(obj)

    return subclasses


def generate_docs(
    package: str,
    printer: ConfigurationPrinter,
    classes: list[str],
    disable_nested: bool,
) -> None:
    """Generate the documentation for all configuration classes in the package."""
    subclasses = __find_subclasses(package)
    if len(classes) > 0:
        subclasses = [
            subclass for subclass in subclasses if subclass.__name__ in classes
        ]
    for subclass in subclasses:
        printer.print(subclass, disable_nested)
