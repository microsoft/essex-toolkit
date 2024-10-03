# Getting Started

essex-config is a Python library for creating configuration objects that read from various sources, including files, environment variables, and Azure Key Vault.

```sh
pip install essex-config
```

## Basic Usage

Create a configuration object for connecting to a customer database:

```python
from pydantic import BaseModel, Field
from essex_config import load_config

class CustomerDatabase(BaseModel):
    """Configuration for connecting to the Customer Database"""
    host: str = Field(default="127.0.0.1", description="DB connection host")
    port: int = Field(description="DB connection port")
    password: str = Field(description="DB connection password")

if __name__ == "__main__":
    config = load_config(CustomerDatabase)
    print(config)
```

When `load_config(CustomerDatabase)` is executed, values are populated from environment variables or default values.

## Nested Configurations

Nest configuration objects:

```python
class Inner(BaseModel):
    inner_hello: str

class NestedConfiguration(BaseModel):
    hello: str
    nested: Inner

nested_config = load_config(NestedConfiguration)
```

`load_config()` populates every field, including `nested_config.nested.inner_hello`. The default prefix for every field in `Inner` is `nested`, which can be changed with `Annotated[Inner, Prefixed("new_prefix")]`.
