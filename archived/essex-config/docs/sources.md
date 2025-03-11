# Sources

Add different sources for configuration data using the `sources` parameter in the `load_config` call:

`essex-config` supports three built-in sources:

1. `EnvSource()`: Reads from environment variables. Looks for the field name in uppercase (e.g., `HOST` for `host`).
2. `FileSource(file_path: Path | str, use_env_var: bool = False)`: Reads from toml, json, or yaml files. `use_env_var=True` allows specifying the file path via an environment variable.
3. `KeyvaultSource(keyvault_name: str, use_env_var: bool = False)`: Fetches values from an Azure Key Vault. `use_env_var=True` allows specifying the Key Vault name via an environment variable.

Example of multiple sources:

```python
from pydantic import BaseModel, Field
from essex_config import load_config
from essex_config.sources import EnvSource, FileSource, KeyVaultSource

class CustomerDatabase(Config):
    """Configuration for connecting to the Customer Database"""
    host: str = Field(default="127.0.0.1", description="DB connection host")
    port: int = Field(description="DB connection port")
    password: str = Field(description="DB connection password")


if __name__ == "__main__":
    config = load_config(CustomerDatabase, sources=[
        EnvSource(),
        FileSource("SETTINGS_PATH", use_env_name=True),
        KeyVaultSource("KEYVAULT_NAME", use_env_name=True),
        FileSource("pyproject.toml")
    ])
    print(config)
    
```

Fields are populated from sources in the specified order.

## Custom Sources

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