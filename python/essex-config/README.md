# essex-configuration

essex-configuration is a Python library for creating configuration objects that read configuration from different sources. This library supports reading from files, environment variables, and Azure Key Vault.

## Installation

To install the essex-configuration library, use pip:

`pip install essex-configuration`

## Usage

Here’s an example of how to use the essex-configuration library to create a configuration object for connecting to a customer database:

```python
from typing import Annotated, ClassVar
from essex_config import Config, ConfigurationField, FieldType
from essex_config.sources import Source, EnvSource, FileSource, KeyvaultSource


class CustomerDatabase(Config):
    """Class that holds the configuration to connect to the Customer Database."""

    sources: ClassVar[list[Source]] = [
        FileSource(file_path="pyproject.toml"),
        EnvSource(),
        FileSource(file_path="settings.json"),
        KeyvaultSource("my-keyvault")
    ]

    host: Annotated[str, ConfigurationField(
        alt_name="customer.host", description="Host ip or url to connect to the database",
    )] = "127.0.0.1"

    port: Annotated[int, ConfigurationField(
        alt_name="customer.port", description="Port to connect to the database",
    )]
    
    password: Annotated[str, ConfigurationField(
        alt_name="customer.password", field_type=FieldType.SECRET, description="Password to connect to sql database"
    )]


if __name__ == "__main__":
    config = CustomerDatabase.get_config()
    print(config)
```

This example creates a CustomerDatabase object with all the fields populated from different sources in the following order:

1. File named pyproject.toml
2. Environment variables
3. File named settings.json
4. Azure Key Vault my-keyvault (requires Azure CLI login using az login)


## ConfigurationField Object

The ConfigurationField object has four possible configurations:

* `field_type`: Can be DEFAULT or SECRET. SECRET will redact values when printed.
* `alt_name`: Alternative name to look for in the configuration. Supports dot-notation for nested values in JSON or TOML files.
* `fallback_names`: Other names to look for in the configuration sources. Also supports dot-notation.
* `description`: Used for documentation purposes.


Documentation Utility
essex-configuration provides a utility to generate documentation for the configuration classes as a markdown file or print the configuration into the terminal.

To generate the documentation, use the following command:

`python -m essex_config.doc_gen <name-of-your-package>`

You can add the --output option with a file name to output a markdown file. The output looks like this:
```markdown
# CustomerDatabase

Class that holds the configuration to connect to the Customer Database.

## Sources

* FileSource(file_path=pyproject.toml)
* EnvSource()
* FileSource(file_path=settings.json)
* KeyvaultSource(keyvault_name=https://my-keyvault.vault.azure.net/)

## Parameters

### host: str
Description: Host ip or url to connect to the database
    Alternative name: customer.host
Required: False
Default: 127.0.0.1

### port: int
Description: Port to connect to the database
    Alternative name: customer.port
Required: True
Default: 

### password: str
Description: Password to connect to sql database
    Alternative name: customer.password
Required: True
Default:
```