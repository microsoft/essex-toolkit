"""Test configuration for the essex-config package."""

import re
from typing import Annotated, TypeVar

import pytest
from pydantic import BaseModel, Field

from essex_config.config import Prefixed, config
from essex_config.sources import Alias, Source
from essex_config.sources.convert_utils import convert_to_type
from essex_config.sources.env_source import EnvSource

T = TypeVar("T")


class MockSource(Source):
    def __init__(self):
        self.data = {
            "hello": "world",
            "prefix.hello": "world prefixed",
            "not_hello": "not world",
            "field_prefix.hello": "world prefixed field",
            "no_prefix_field": 1,
            "nested.hello": "nested world",
            "nested2.hello": "nested2 world",
            "nested.not_hello_nested": "nested alias world",
            "not_int": "this is not a int value",
        }
        super().__init__()

    def _get_value(self, key: str, value_type: type[T]) -> T:
        return convert_to_type(self.data[key], value_type)

    def __contains__(self, key: str) -> bool:  # pragma: no cover
        """Check if the key is present in the source."""
        return key in self.data


def test_basic_config():
    @config(sources=[MockSource()])
    class BasicConfiguration(BaseModel):
        hello: str

    basic_config = BasicConfiguration.load_config()
    assert basic_config.hello == "world"

    assert type(basic_config) == BasicConfiguration


def test_prefixed_config():
    @config(prefix="prefix", sources=[MockSource()])
    class PrefixedConfiguration(BaseModel):
        hello: str

    basic_config = PrefixedConfiguration.load_config()
    assert basic_config.hello == "world prefixed"


def test_alias_config():
    @config(sources=[MockSource()])
    class AliasConfiguration(BaseModel):
        hello: Annotated[str, Alias(MockSource, ["not_hello"])]

    basic_config = AliasConfiguration.load_config()
    assert basic_config.hello == "not world"


def test_prefixed_field_config():
    @config(sources=[MockSource()])
    class PrefixedFieldConfiguration(BaseModel):
        hello: Annotated[str, Prefixed("field_prefix")]
        no_prefix_field: int

    basic_config = PrefixedFieldConfiguration.load_config()
    assert basic_config.hello == "world prefixed field"
    assert basic_config.no_prefix_field == 1


def test_nested_config():
    class Inner(BaseModel):
        hello: str

    @config(sources=[MockSource()])
    class NestedConfiguration(BaseModel):
        hello: str
        nested: Inner

    basic_config = NestedConfiguration.load_config()
    assert basic_config.hello == "world"
    assert basic_config.nested.hello == "nested world"


def test_nested_prefixed_field_config():
    class Inner(BaseModel):
        hello: str

    @config(sources=[MockSource()])
    class NestedConfiguration(BaseModel):
        hello: str
        nested: Annotated[Inner, Prefixed("nested2")]

    basic_config = NestedConfiguration.load_config()
    assert basic_config.hello == "world"
    assert basic_config.nested.hello == "nested2 world"


def test_nested_alias():
    class Inner(BaseModel):
        hello: Annotated[str, Alias(MockSource, ["not_hello_nested"])]

    @config(sources=[MockSource()])
    class NestedConfiguration(BaseModel):
        hello: str
        nested: Inner

    basic_config = NestedConfiguration.load_config()
    assert basic_config.hello == "world"
    assert basic_config.nested.hello == "nested alias world"


def test_nested_alias_for_different_source():
    class Inner(BaseModel):
        hello: Annotated[str, Alias(EnvSource, ["this_should_be_ignored"])]

    @config(sources=[MockSource()])
    class NestedConfiguration(BaseModel):
        hello: str
        nested: Inner

    basic_config = NestedConfiguration.load_config()
    assert basic_config.hello == "world"
    assert basic_config.nested.hello == "nested world"


def test_cache_and_refresh():
    source = MockSource()

    @config(sources=[source])
    class BasicConfiguration(BaseModel):
        hello: str

    basic_config = BasicConfiguration.load_config()
    assert basic_config.hello == "world"

    source.data["hello"] = "new world"

    basic_config = BasicConfiguration.load_config()
    assert basic_config.hello == "world"

    basic_config = BasicConfiguration.load_config(refresh_config=True)
    assert basic_config.hello == "new world"


def test_basic_default_no_value_config():
    @config(sources=[MockSource()])
    class BasicConfiguration(BaseModel):
        not_a_value_in_config: str = "hello"

    basic_config = BasicConfiguration.load_config()
    assert basic_config.not_a_value_in_config == "hello"


def test_basic_default_no_value_field_config():
    @config(sources=[MockSource()])
    class BasicConfiguration(BaseModel):
        not_a_value_in_config: str = Field(default="hello")

    basic_config = BasicConfiguration.load_config()
    assert basic_config.not_a_value_in_config == "hello"


def test_basic_default_no_value_field_factory_config():
    @config(sources=[MockSource()])
    class BasicConfiguration(BaseModel):
        not_a_value_in_config: str = Field(default_factory=lambda: "hello")

    basic_config = BasicConfiguration.load_config()
    assert basic_config.not_a_value_in_config == "hello"


def test_missing_key():
    @config(sources=[MockSource()])
    class KeyErrorConfig(BaseModel):
        not_valid_key: str

    with pytest.raises(
        ValueError,
        match="Value for not_valid_key is required and not found in any source.",
    ):
        KeyErrorConfig.load_config()


def test_not_required_field():
    @config(sources=[MockSource()])
    class NotRequiredConfig(BaseModel):
        not_required_key: str | None = None

    assert NotRequiredConfig.load_config().not_required_key is None


def test_union_type():
    @config(sources=[MockSource()])
    class UnionTypeConfig(BaseModel):
        hello: int | str | None = None
        no_prefix_field: int | str | None = None

    assert UnionTypeConfig.load_config().hello == "world"
    assert UnionTypeConfig.load_config().no_prefix_field == 1


def test_nested_optional():
    class Inner(BaseModel):
        hello: str

    @config(sources=[MockSource()])
    class NestedConfiguration(BaseModel):
        hello: str
        not_valid_key: Inner | None = None
        nested: Inner | None

    basic_config = NestedConfiguration.load_config()
    assert basic_config.hello == "world"
    assert basic_config.not_valid_key is None
    assert isinstance(basic_config.nested, Inner)
    assert basic_config.nested.hello == "nested world"


def test_wrong_type():
    @config(sources=[MockSource()])
    class WrongTypeConfig(BaseModel):
        not_int: int

    with pytest.raises(
        ValueError,
        match=re.escape(
            "Cannot convert [this is not a int value] to type [<class 'int'>]."
        ),
    ):
        WrongTypeConfig.load_config()


def test_wrong_union_type():
    @config(sources=[MockSource()])
    class WrongTypeConfig(BaseModel):
        hello: int | float | None = None

    with pytest.raises(
        ValueError,
        match=re.escape(
            "Cannot convert [world] to any of the types [(<class 'int'>, <class 'float'>, <class 'NoneType'>)]."
        ),
    ):
        WrongTypeConfig.load_config()
