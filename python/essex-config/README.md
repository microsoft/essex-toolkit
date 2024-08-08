# essex-config

essex-config is a Python library for creating configuration objects that read from various sources, including files, environment variables, and Azure Key Vault.

## Installation

Install the essex-config library using pip:

```sh
pip install essex-config
```

## Basic Usage

Create a configuration object for connecting to a customer database:

```python
from pydantic import BaseModel, Field
from essex_config import config

@config()
class CustomerDatabase(BaseModel):
    """Configuration for connecting to the Customer Database"""
    host: str = Field(default="127.0.0.1", description="DB connection host")
    port: int = Field(description="DB connection port")
    password: str = Field(description="DB connection password")

if __name__ == "__main__":
    config = CustomerDatabase.load_config()
    print(config)
```

When `CustomerDatabase.load_config()` is executed, values are populated from environment variables or default values.

## Advanced Usage

### Sources

Add different sources for configuration data using the `sources` parameter in the `@config` decorator:

```python
from essex_config.sources import EnvSource

@config(sources=[EnvSource()])
class CustomerDatabase(BaseModel):
    ...
```

`essex-config` supports three built-in sources:

1. `EnvSource()`: Reads from environment variables. Looks for the field name in uppercase (e.g., `HOST` for `host`).
2. `FileSource(file_path: Path | str, use_env_var: bool = False)`: Reads from toml, json, or yaml files. `use_env_var=True` allows specifying the file path via an environment variable.
3. `KeyvaultSource(keyvault_name: str, use_env_var: bool = False)`: Fetches values from an Azure Key Vault. `use_env_var=True` allows specifying the Key Vault name via an environment variable.

Example of multiple sources:

```python
from pydantic import BaseModel, Field
from essex_config import config
from essex_config.sources import EnvSource, FileSource, KeyVaultSource

@config(sources=[
    EnvSource(),
    FileSource("SETTINGS_PATH", use_env_name=True),
    KeyVaultSource("KEYVAULT_NAME", use_env_name=True),
    FileSource("pyproject.toml")
])
class CustomerDatabase(Config):
    """Configuration for connecting to the Customer Database"""
    host: str = Field(default="127.0.0.1", description="DB connection host")
    port: int = Field(description="DB connection port")
    password: str = Field(description="DB connection password")
```

Fields are populated from sources in the specified order.

### Custom Sources

Define custom sources by implementing a `Source` object and overriding the `_get_value()` and `__contains__()` methods. Optionally override the `_format()` method to provide a custom formatting for the prefix and key.

Example of a custom source:

```python
T = TypeVar("T")

class MockSource(Source):
    def __init__(self):
        self.data = {
            "hello": "world"
        }

    def _get_value(self, key: str, value_type: type[T]) -> T:
        return convert_to_type(self.data[key], value_type)

    def __contains__(self, key: str) -> bool:
        """Check if the key is present in the source."""
        return key in self.data
```

### Prefixes

The `@config` decorator supports using a prefix for values in different sources:

```python
@config(prefix="customer_db")
class CustomerDatabase(BaseModel):
    """Configuration for connecting to the Customer Database"""
    host: str = Field(default="127.0.0.1", description="DB connection host")
    port: int = Field(description="DB connection port")
    password: str = Field(description="DB connection password")
```

With a prefix, sources look for values accordingly:

* `EnvSource()`: Uses UPPER_SNAKE_CASE (e.g., `CUSTOMER_DB_HOST`, `CUSTOMER_DB_PORT`, `CUSTOMER_DB_PASSWORD`).
* `FileSource()`: Looks deeper into the file structure (e.g., `customer_db.host`).
* `KeyvaultSource()`: Joins the prefix with the key using `.`.

To add a prefix for a specific field, use `Annotated`:

```python
@config(prefix="customer_db")
class CustomerDatabase(BaseModel):
    """Configuration for connecting to the Customer Database"""
    host: Annotated[str, Prefixed("some_prefix")] = Field(default="127.0.0.1", description="DB connection host")
    port: int = Field(description="DB connection port")
    password: str = Field(description="DB connection password")
```

In this case, the prefix for `host` will be `customer_db.some_prefix`.

### Alias

Use `Annotated` to add source-specific aliases:

```python
@config(prefix="db")
class CustomerDatabase(BaseModel):
    """Configuration for connecting to the Customer Database"""
    host: Annotated[str, Alias(EnvSource, ["customer_db_host"])] = Field(default="127.0.0.1", description="DB connection host")
    port: int = Field(description="DB connection port")
    password: str = Field(description="DB connection password")
```

`essex-config` will look to populate `host` from `db.customer_db_host` when using the `EnvSource`.

### Nested Configurations

Nest configuration objects:

```python
class Inner(BaseModel):
    inner_hello: str

@config()
class NestedConfiguration(BaseModel):
    hello: str
    nested: Inner

nested_config = NestedConfiguration.load_config()
```

`load_config()` populates every field, including `nested_config.nested.inner_hello`. The default prefix for every field in `Inner` is `nested`, which can be changed with `Annotated[Inner, Prefixed("new_prefix")]`.


## Documentation Generation

Generate documentation for configuration classes as a markdown file or print to the terminal:

python -m essex_config.doc_gen <name-of-your-package>

Add the --output option to specify a markdown file.

Example of the markdown can be found in CONFIG_EXAMPLE.md