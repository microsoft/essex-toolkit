# MainConfiguration
*Configuration Prefix: test*

Main configuration class for the project.

Documentation generation supports markdown

## This is a header

Example markdown text.

## Sources:

* EnvSource()
* FileSource(file_path=config.yml)

## Parameters:

|Name|Description|Alias|Prefix|Required?|Default|
|---|---|---|---|---|---|
|string_example: str|A string.|||True||
|int_example: int|An integer.|FileSource: ['another_int']||False|42|
|bool_example: bool|An integer.|||True||
|nested: NestedConfiguration|See nested: NestedConfiguration for more details.|||True||
|nested_2: NestedConfiguration|See nested_2: NestedConfiguration for more details.||hello|True||

# nested: NestedConfiguration
Nested configuration class for the project.
## Parameters:

|Name|Description|Alias|Prefix|Required?|Default|
|---|---|---|---|---|---|
|a_nested_string: str|A nested string.||nested|True||
|a_nested_int: int|A nested integer.|FileSource: ['int']<br>EnvSource: ['INTEGER']|nested|True||
|prefixed_test: float|A prefixed float.||nested.test|False|3.14|

# nested_2: NestedConfiguration
Nested configuration class for the project.
## Parameters:

|Name|Description|Alias|Prefix|Required?|Default|
|---|---|---|---|---|---|
|a_nested_string: str|A nested string.||hello|True||
|a_nested_int: int|A nested integer.|FileSource: ['int']<br>EnvSource: ['INTEGER']|hello|True||
|prefixed_test: float|A prefixed float.||hello.test|False|3.14|

