# essex-configuration

essex-configuration is a Python library for creating configuration objects that can read from various sources, including files, environment variables, and Azure Key Vault.

## Installation

To install the essex-configuration library, use pip:

`pip install essex-configuration`

## Basic Usage

Here's how to create a configuration object for connecting to a customer database:


```python
from typing import Annotated, ClassVar
from essex_config import Config, ConfigurationField, FieldVisibility


class CustomerDatabase(Config):
    """Class that holds the configuration to connect to the Customer Database"""

    host: Annotated[str, ConfigurationField(
        description="Host ip or url to connect to the database",
    )] = "127.0.0.1"

    port: Annotated[int, ConfigurationField(
        description="Port to connect to the database",
    )]
    
    password: Annotated[str, ConfigurationField(
        field_visibility=FieldVisibility.SECRET, description="Password to connect to sql database"
    )]


if __name__ == "__main__":
    config = CustomerDatabase.get_config()
    print(config)
```

When `CustomerDatabase.get_config()` is executed, the values will be populated from environment variables or default values.


## Advanced Usage


### Sources

You can add different sources for configuration data by defining the `sources` class variable:

```python
class MyConfig(Config):
    sources: ClassVar[list[Source]] = ...
```

`essex-configuration` supports three built-in sources:

1. `EnvSource()`: Default source, reads from environment variables.
2. `FileSource(file_path: Path | str, use_env_var: bool = False)`: Reads from a toml, json, or yaml file. use_env_var=True allows the file path to be specified via an environment variable.
3. `KeyvaultSource(keyvault_name: str, use_env_var: bool = False)`: Fetches values from an Azure Key Vault. use_env_var=True allows the Key Vault name to be specified via an environment variable.

Example of multiple sources:

```python
from typing import Annotated, ClassVar
from essex_config import Config, ConfigurationField, FieldVisibility

class CustomerDatabase(Config):
    """Configuration for connecting to the Customer Database"""

    sources: ClassVar[list[Source]] = [
        EnvSource(),
        FileSource("SETTINGS_PATH", use_env_name=True),
        KeyVaultSource("KEYVAULT_NAME", use_env_name=True),
        FileSource("pyproject.toml"),
    ]

    host: Annotated[str, ConfigurationField(
        description="Database host IP or URL",
    )] = "127.0.0.1"

    port: Annotated[int, ConfigurationField(
        description="Database port",
    )]

    password: Annotated[str, ConfigurationField(
        field_visibility=FieldVisibility.SECRET,
        description="Database password",
    )]
```
Fields will be populated from sources in the specified order.


### Custom Sources

You can define custom sources by implementing a `Source` object. Override the `get_data()` method to return a dictionary of configuration data.

Example of a custom source:

```python
T = TypeVar("T")

class CustomSource(Source):
    """Class to get the configuration from the environment."""

    def __init__(self, any_custom_data: Any):
        self.data = any_custom_data

    def get_value(self, key: str, value_type: type[T]) -> T:
        """Get the value from a source"""
        # custom logic to get the value
        value = ...
        # if the value is not found you should return a KeyError

        return value

    def __str__(self) -> str:
        """Return the string representation of the source."""
        return "CustomSource()"

```

### ConfigurationField Object

The ConfigurationField object has four possible configurations:

* `field_visibility`: Can be DEFAULT or SECRET. SECRET (redacts values when printed).
* `alias`: Alternative name for the configuration field.
* `fallback_names`: Additional names to look for in configuration sources.
* `description`: For documentation purposes.


### Field population

The library searches for field values in the following order:

1. Field name
2. Alternative name (`alias`)
3. Fallback names (`fallback_names`)
4. Prefixed with the class name (e.g., MyConfig.field_name)
5. Uppercased and underscores replacing dots (e.g., FIELD_NAME)

When using dot-notation with `alias` or `fallback_names` the population mechanism will traverse the Source dictionary to assign a value, the same applies for the prefix with class name rule.

If the field is required and no value is found, a ValueError is raised.

### Nested Configurations

You can nest configuration objects:

```python
class SubConfig(Config):
    value4: Annotated[bool, ConfigurationField()]

class TopLevelConfig(Config):
    sub_config: SubConfig
    value1: Annotated[str, ConfigurationField()]
```

When using `TopLevelConfig.get_config()`, you can access `config.sub_config.value4`. The nested configuration follows the same population rules, the "Prefixed with class name" rule will use `TopLevelConfig.SubConfig` prefix for the `SubConfig` values when using in nested configuration mode.

## Documentation Utility
Generate documentation for configuration classes as a markdown file or print to the terminal:

`python -m essex_config.doc_gen <name-of-your-package>`

Add the --output option to specify a markdown file.

Example output:
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