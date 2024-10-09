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

## Parser

You can use custom parsers to handle specific data formats. For example:

```python
class CustomParserConfig(BaseModel):
    custom_parser: Annotated[list[int], Parser(json_list_parser)]

config = load_config(CustomParserConfig)
print(config.custom_parser)
```

Essex-config offers `json_list_parser` and `plain_text_list_parser` by default from `essex_config.sources.utils`. You can also create your own parsers by providing a function that takes a string and a type as arguments and returns an instance of that type.

## Updatable

The Updatable annotation indicates that the variable can be updated by other sources. For example:

```python
class UpdatableConfig(BaseModel):
    value: Annotated[dict[str, Any], Updatable(lambda x, y: {**x, **y})]

config = load_config(
    UpdatableConfig,
    sources=[
        ArgSource(value={"a": 1}),
        ArgSource(value={"b": 2}),
        ArgSource(value={"a": 3}),
    ],
)
print(config.value)
```

In this case, Updatable gets a function that defines how to update the variable and the `config.value` will contain:

```python
{
    "a": 3,
    "b": 2
}
```