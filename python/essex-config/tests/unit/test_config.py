"""Test configuration for the essex-config package."""

import os
import re
from pathlib import Path
from typing import Annotated, Any, TypeVar
from unittest import mock

import pytest
from pydantic import BaseModel, Field

from essex_config import load_config
from essex_config.field_annotations import Alias, Parser, Prefixed, Updatable
from essex_config.sources import Source
from essex_config.sources.args_source import ArgSource
from essex_config.sources.env_source import EnvSource
from essex_config.sources.file_source import FileSource
from essex_config.sources.utils import json_list_parser, plain_text_list_parser

T = TypeVar("T")


@pytest.fixture
def _mock_env_vars():
    with mock.patch.dict(
        os.environ,
        {"TEST_VALUE": "test value"},
        clear=True,
    ):
        yield


class MockSource(Source):
    def __init__(self, prefix: str | None = None):
        self.data = {
            "hello": "world",
            "prefix.hello": "world prefixed",
            "not_hello": "not world",
            "field_prefix.hello": "world prefixed field",
            "source_prefix.field_prefix.hello": "world prefixed field",
            "no_prefix_field": 1,
            "nested.hello": "nested world",
            "nested2.hello": "nested2 world",
            "nested.not_hello_nested": "nested alias world",
            "not_int": "this is not a int value",
            "custom_parser": "[1,2,3,4]",
            "custom_parser2": "1,2,3,4",
            "malformed_json": "[1,2,3,4",
            "hex_string": "0xDEADBEEF",
            "lower_false": "false",
            "plain_text_list": "1,2,3,4",
            "env_var": "${TEST_VALUE}",
            "env_list": '["${TEST_VALUE}", "world"]',
            "env_dict": '{"key": "${TEST_VALUE}", "key2": "world"}',
            "escaped_template_str": "$${DO_NOT_REPLACE}",
            "nested.env_var": "${TEST_VALUE}",
        }
        super().__init__(prefix)

    def _get_value(
        self,
        key: str,
    ) -> Any:
        return self.data[key]

    def __contains__(self, key: str) -> bool:  # pragma: no cover
        """Check if the key is present in the source."""
        return key in self.data


def test_basic_config():
    class BasicConfiguration(BaseModel):
        hello: str

    basic_config = load_config(BasicConfiguration, sources=[MockSource()])
    assert basic_config.hello == "world"

    assert isinstance(basic_config, BasicConfiguration)


def test_prefixed_config():
    class PrefixedConfiguration(BaseModel):
        hello: str

    basic_config = load_config(
        PrefixedConfiguration, sources=[MockSource()], prefix="prefix"
    )
    assert basic_config.hello == "world prefixed"


def test_prefixed_source():
    class PrefixedConfiguration(BaseModel):
        hello: str

    basic_config = load_config(
        PrefixedConfiguration, sources=[MockSource(prefix="prefix")]
    )
    assert basic_config.hello == "world prefixed"


def test_prefixed_source_overrides_config():
    class PrefixedConfiguration(BaseModel):
        hello: str

    basic_config = load_config(
        PrefixedConfiguration,
        sources=[MockSource(prefix="prefix")],
        prefix="override this",
    )
    assert basic_config.hello == "world prefixed"


def test_alias_config():
    class AliasConfiguration(BaseModel):
        hello: Annotated[str, Alias(MockSource, ["not_hello"])]

    basic_config = load_config(AliasConfiguration, sources=[MockSource()])
    assert basic_config.hello == "not world"


def test_prefixed_field_config():
    class PrefixedFieldConfiguration(BaseModel):
        hello: Annotated[str, Prefixed("field_prefix")]
        no_prefix_field: int

    basic_config = load_config(PrefixedFieldConfiguration, sources=[MockSource()])
    assert basic_config.hello == "world prefixed field"
    assert basic_config.no_prefix_field == 1


def test_prefixed_field_config_with_source_prefix():
    class PrefixedFieldConfiguration(BaseModel):
        hello: Annotated[str, Prefixed("field_prefix")]

    basic_config = load_config(
        PrefixedFieldConfiguration, sources=[MockSource(prefix="source_prefix")]
    )
    assert basic_config.hello == "world prefixed field"


def test_nested_config():
    class Inner(BaseModel):
        hello: str

    class NestedConfiguration(BaseModel):
        hello: str
        nested: Inner

    basic_config = load_config(NestedConfiguration, sources=[MockSource()])
    assert basic_config.hello == "world"
    assert basic_config.nested.hello == "nested world"


def test_nested_prefixed_field_config():
    class Inner(BaseModel):
        hello: str

    class NestedConfiguration(BaseModel):
        hello: str
        nested: Annotated[Inner, Prefixed("nested2")]

    basic_config = load_config(NestedConfiguration, sources=[MockSource()])
    assert basic_config.hello == "world"
    assert basic_config.nested.hello == "nested2 world"


def test_nested_alias():
    class Inner(BaseModel):
        hello: Annotated[
            str, Alias(MockSource, ["not_hello_nested"], include_prefix=True)
        ]

    class NestedConfiguration(BaseModel):
        hello: str
        nested: Inner

    basic_config = load_config(NestedConfiguration, sources=[MockSource()])
    assert basic_config.hello == "world"
    assert basic_config.nested.hello == "nested alias world"


def test_nested_alias_for_different_source():
    class Inner(BaseModel):
        hello: Annotated[str, Alias(EnvSource, ["this_should_be_ignored"])]

    class NestedConfiguration(BaseModel):
        hello: str
        nested: Inner

    basic_config = load_config(NestedConfiguration, sources=[MockSource()])
    assert basic_config.hello == "world"
    assert basic_config.nested.hello == "nested world"


def test_cache_and_refresh():
    source = MockSource()

    class BasicConfiguration(BaseModel):
        hello: str

    basic_config = load_config(BasicConfiguration, sources=[source])
    assert basic_config.hello == "world"

    source.data["hello"] = "new world"

    basic_config = load_config(BasicConfiguration, sources=[source])
    assert basic_config.hello == "world"

    basic_config = load_config(
        BasicConfiguration, sources=[source], refresh_config=True
    )
    assert basic_config.hello == "new world"


def test_basic_default_no_value_config():
    class BasicConfiguration(BaseModel):
        not_a_value_in_config: str = "hello"

    basic_config = load_config(BasicConfiguration, sources=[MockSource()])
    assert basic_config.not_a_value_in_config == "hello"


def test_basic_default_no_value_field_config():
    class BasicConfiguration(BaseModel):
        not_a_value_in_config: str = Field(default="hello")

    basic_config = load_config(BasicConfiguration, sources=[MockSource()])
    assert basic_config.not_a_value_in_config == "hello"


def test_basic_default_no_value_field_factory_config():
    class BasicConfiguration(BaseModel):
        not_a_value_in_config: str = Field(default_factory=lambda: "hello")

    basic_config = load_config(BasicConfiguration, sources=[MockSource()])
    assert basic_config.not_a_value_in_config == "hello"


def test_missing_key():
    class KeyErrorConfig(BaseModel):
        not_valid_key: str

    with pytest.raises(
        ValueError,
        match="Value for not_valid_key is required and not found in any source.",
    ):
        load_config(KeyErrorConfig, sources=[MockSource()])


def test_not_required_field():
    class NotRequiredConfig(BaseModel):
        not_required_key: str | None = None

    assert (
        load_config(NotRequiredConfig, sources=[MockSource()]).not_required_key is None
    )


def test_union_type():
    class UnionTypeConfig(BaseModel):
        hello: int | str | None = None
        no_prefix_field: int | str | None = None

    config = load_config(UnionTypeConfig, sources=[MockSource()])
    assert config.hello == "world"
    assert config.no_prefix_field == 1


def test_nested_optional():
    class Inner(BaseModel):
        hello: str

    class NestedConfiguration(BaseModel):
        hello: str
        not_valid_key: Inner | None = None
        nested: Inner | None

    basic_config = load_config(NestedConfiguration, sources=[MockSource()])
    assert basic_config.hello == "world"
    assert basic_config.not_valid_key is None
    assert isinstance(basic_config.nested, Inner)
    assert basic_config.nested.hello == "nested world"


def test_wrong_type():
    class WrongTypeConfig(BaseModel):
        not_int: int

    with pytest.raises(
        ValueError,
        match=re.escape(
            "Cannot convert [this is not a int value] to type [<class 'int'>]."
        ),
    ):
        load_config(WrongTypeConfig, sources=[MockSource()])


def test_wrong_union_type():
    class WrongTypeConfig(BaseModel):
        hello: int | float | None = None

    with pytest.raises(
        ValueError,
        match=re.escape(
            "Cannot convert [world] to any of the types [(<class 'int'>, <class 'float'>, <class 'NoneType'>)]."
        ),
    ):
        load_config(WrongTypeConfig, sources=[MockSource()])


def test_custom_parser():
    class CustomParserConfig(BaseModel):
        custom_parser: Annotated[list[int], Parser(json_list_parser)]

    basic_config = load_config(CustomParserConfig, sources=[MockSource()])
    assert basic_config.custom_parser == [1, 2, 3, 4]


def test_custom_parser_malformed_json():
    class CustomParserConfig(BaseModel):
        malformed_json: Annotated[list[int], Parser(json_list_parser)]

    with pytest.raises(
        ValueError,
        match=re.escape("Error parsing the value [1,2,3,4 for key malformed_json."),
    ):
        load_config(CustomParserConfig, sources=[MockSource()])


def test_custom_parser_str():
    class CustomParserConfig(BaseModel):
        custom_parser2: Annotated[
            list[str], Parser(lambda x, _: [str(i) for i in x.split(",")])
        ]

    basic_config = load_config(CustomParserConfig, sources=[MockSource()])
    assert basic_config.custom_parser2 == ["1", "2", "3", "4"]


def test_custom_parser_hex_values():
    class CustomParserConfig(BaseModel):
        hex_string: Annotated[int, Parser(lambda x, _: int(x, 0))]

    basic_config = load_config(CustomParserConfig, sources=[MockSource()])
    assert basic_config.hex_string == 0xDEADBEEF


def test_add_runtime_source():
    class Inner(BaseModel):
        value: str

    class RuntimeSourceConfig(BaseModel):
        hello: str
        runtime_source_var: str
        nested: Inner
        lower_false: bool
        random_bool: bool

    basic_config = load_config(
        RuntimeSourceConfig,
        sources=[
            MockSource(),
            ArgSource(
                runtime_source_var="runtime",
                random_bool="this is not false",
                **{"nested.value": "world"},
            ),
        ],
    )
    assert basic_config.hello == "world"
    assert basic_config.runtime_source_var == "runtime"
    assert basic_config.nested.value == "world"
    assert basic_config.lower_false is False
    assert basic_config.random_bool is True


def test_plain_text_parser():
    class CustomParserConfig(BaseModel):
        plain_text_list: Annotated[list[int], Parser(plain_text_list_parser())]

    basic_config = load_config(CustomParserConfig, sources=[MockSource()])
    assert basic_config.plain_text_list == [1, 2, 3, 4]


def test_malformed_plaintext_list():
    class RuntimeSourceConfig(BaseModel):
        malformed_list: Annotated[list[int], Parser(plain_text_list_parser())]

    with pytest.raises(
        ValueError, match="Error parsing the value 1,2,3,a for key malformed_list."
    ):
        load_config(RuntimeSourceConfig, sources=[ArgSource(malformed_list="1,2,3,a")])


def test_updatable_dict():
    class UpdatableConfig(BaseModel):
        value: Annotated[dict[str, Any], Updatable(lambda x, y: {**x, **y})]

    basic_config = load_config(
        UpdatableConfig,
        sources=[
            ArgSource(value={"a": 1}),
            ArgSource(value={"b": 2}),
            ArgSource(value={"a": 3}),
        ],
    )

    assert basic_config.value == {"a": 3, "b": 2}


def test_updatable_replace_dict():
    class UpdatableConfig(BaseModel):
        value: Annotated[dict[str, Any], Updatable(lambda _, y: y)]

    basic_config = load_config(
        UpdatableConfig,
        sources=[
            ArgSource(value={"a": 1}),
            ArgSource(value={"b": 2}),
            ArgSource(value={"a": 3}),
        ],
    )

    assert basic_config.value == {"a": 3}


def test_default_order_behavior():
    class NonUpdatableConfig(BaseModel):
        value: dict[str, Any]

    basic_config = load_config(
        NonUpdatableConfig,
        sources=[
            ArgSource(value={"a": 1}),
            ArgSource(value={"b": 2}),
            ArgSource(value={"a": 3}),
        ],
    )

    assert basic_config.value == {"a": 1}


@pytest.mark.usefixtures("_mock_env_vars")
def test_parsing_env_variables():
    class NestedConfig(BaseModel):
        env_var: str

    class BasicConfiguration(BaseModel):
        env_var: str
        escaped_template_str: str
        nested: NestedConfig
        env_list: Annotated[list[str], Parser(json_list_parser)]
        env_dict: dict[str, str]
        other: set[str] = Field(default_factory=lambda: {"hello"})

    basic_config = load_config(
        BasicConfiguration, sources=[MockSource()], parse_env_values=True
    )
    assert basic_config.env_var == "test value"
    assert basic_config.escaped_template_str == "${DO_NOT_REPLACE}"
    assert basic_config.nested.env_var == "test value"
    assert basic_config.env_list == ["test value", "world"]
    assert basic_config.env_dict == {"key": "test value", "key2": "world"}
    assert basic_config.other == {"hello"}

    assert isinstance(basic_config, BasicConfiguration)


def test_parsing_missing_env_variables():
    class BasicConfiguration(BaseModel):
        env_var: str

    with pytest.raises(
        KeyError,
        match=re.escape("TEST_VALUE"),
    ):
        load_config(
            BasicConfiguration,
            sources=[MockSource()],
            parse_env_values=True,
        )


def test_parsing_env_variables_with_dotenv_file():
    class BasicConfiguration(BaseModel):
        env_var: str
        escaped_template_str: str

    env_file = (Path(__file__).parent / ".." / ".env.test").resolve()

    basic_config = load_config(
        BasicConfiguration,
        sources=[
            MockSource(),
            EnvSource(file_path=env_file, required=True),
            EnvSource(),
        ],
        parse_env_values=True,
        refresh_config=True,
    )
    assert basic_config.env_var == "test value"
    assert basic_config.escaped_template_str == "${DO_NOT_REPLACE}"

    assert isinstance(basic_config, BasicConfiguration)


def test_use_file_source_after_env_with_prefix():
    class BasicConfiguration(BaseModel):
        test_value: bool

    yaml_file = (Path(__file__).parent / ".." / "test.yaml").resolve()

    basic_config = load_config(
        BasicConfiguration,
        sources=[
            EnvSource(prefix="TEST"),
            FileSource(file_path=yaml_file),
        ],
    )
    assert basic_config.test_value

    assert isinstance(basic_config, BasicConfiguration)
