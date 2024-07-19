# ExampleConfig

Example of a configuration class that uses sub configurations.

## Sources

* EnvSource()
## Parameters

### config_value: str

* Required: `True`
### another_config_value: float
* Fallback names: `fallbacks.another_config_value`
* Required: `True`
### sub_config: ExampleSubConfig
See the [ExampleSubConfig](#ExampleSubConfig) section for more details

* Required: `True`
# ExampleSubConfig

Example of a sub configuration class.

## Sources

* EnvSource()
## Parameters

### sub_config_value: str

* Required: `True`
### another_sub_config_value: int
* Alternative name: `sub_config_alias`
* Required: `True`
### sub_sub_config: ExampleSubSubConfig
See the [ExampleSubSubConfig](#ExampleSubSubConfig) section for more details

* Required: `True`
# ExampleSubSubConfig

Example of a sub-sub configuration class.

## Sources

* EnvSource()
## Parameters

### sub_sub_config_value: str

* Required: `False`
* Default: `default_value`

