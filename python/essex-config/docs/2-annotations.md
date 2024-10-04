# Field Annotations

Essex-config offers Annotations for fields which modifies the behavior of the basic configuration loading.

## Prefixes

The `load_config` function supports using a prefix for values in different sources:

```python
class CustomerDatabase(BaseModel):
    """Configuration for connecting to the Customer Database"""
    host: str = Field(default="127.0.0.1", description="DB connection host")
    port: int = Field(description="DB connection port")
    password: str = Field(description="DB connection password")


if __name__ == "__main__":
    config = load_config(CustomerDatabase, prefix="customer_db")
    print(config)

```

With a prefix, sources look for values accordingly:

* `EnvSource()`: Uses UPPER_SNAKE_CASE (e.g., `CUSTOMER_DB_HOST`, `CUSTOMER_DB_PORT`, `CUSTOMER_DB_PASSWORD`).
* `FileSource()`: Looks deeper into the file structure (e.g., `customer_db.host`).
* `KeyvaultSource()`: Joins the prefix with the key using `.`.

To add a prefix for a specific field, use `Annotated`:

```python
class CustomerDatabase(BaseModel):
    """Configuration for connecting to the Customer Database"""
    host: Annotated[str, Prefixed("some_prefix")] = Field(default="127.0.0.1", description="DB connection host")
    port: int = Field(description="DB connection port")
    password: str = Field(description="DB connection password")
```

In this case, the prefix for `host` will be `customer_db.some_prefix`.

## Alias

Use `Annotated` to add source-specific aliases:

```python
class CustomerDatabase(BaseModel):
    """Configuration for connecting to the Customer Database"""
    host: Annotated[str, Alias(EnvSource, ["customer_db_host"])] = Field(default="127.0.0.1", description="DB connection host")
    port: int = Field(description="DB connection port")
    password: str = Field(description="DB connection password")
```

`essex-config` will look to populate `host` from `customer_db_host` when using the `EnvSource`.