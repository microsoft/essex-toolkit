import os
from pathlib import Path
from unittest import mock

import pytest

from essex_config.sources import FileSource


def test_str_file_source():
    source = FileSource(Path(__file__).parent / "file_source_fixtures" / "test.json")
    assert "TEST_VALUE" in source
    assert source.get_value("TEST_VALUE", str) == "test_value"


def test_toml_file():
    source = FileSource(Path(__file__).parent / "file_source_fixtures" / "test.toml")
    assert source.get_value("test.hello", str) == "world"
    assert source.get_value("test.integer", int) == 42


def test_yaml_source():
    source = FileSource(Path(__file__).parent / "file_source_fixtures" / "test.yaml")
    assert "test.hello" in source
    assert source.get_value("test.hello", str) == "world"
    assert source.get_value("test.integer", int) == 42


def test_json_source():
    mock_data = '{"TEST_VALUE": "test_value"}'
    with mock.patch("pathlib.Path.open", mock.mock_open(read_data=mock_data)):
        source = FileSource(Path("dummy.json"))
        assert source.get_value("TEST_VALUE", str) == "test_value"

        assert str(source) == "FileSource(file_path=dummy.json)"
        assert repr(source) == "FileSource(file_path=dummy.json)"
        assert source.__rich__() == "FileSource(file_path=dummy.json)"


def test_key_not_found():
    mock_data = b"""test:
      hello: world
      integer: 42"""
    with mock.patch("pathlib.Path.open", mock.mock_open(read_data=mock_data)):
        source = FileSource(Path("dummy.yaml"))
        assert "not_found" not in source
        with pytest.raises(KeyError, match="Key not_found not found in the source."):
            source.get_value("not_found", str)


def test_inner_key_not_found():
    mock_data = b"""test:
      hello: world
      integer: 42"""
    with mock.patch("pathlib.Path.open", mock.mock_open(read_data=mock_data)):
        source = FileSource(Path("dummy.yaml"))
        assert "test.not_found" not in source
        with pytest.raises(
            KeyError, match="Key test.not_found not found in the source."
        ):
            source.get_value("test.not_found", str)


def test_unknown_file_source():
    source = FileSource(Path("dummy.txt"))
    with pytest.raises(ValueError, match="File type .txt not supported."):
        source.get_value("Anything", str)


def test_env_name_file_source():
    # Set the environment variable
    os.environ["FILE_NAME"] = "my_file.yml"

    mock_data = b"""test:
      hello: world"""

    with mock.patch("pathlib.Path.open", mock.mock_open(read_data=mock_data)):
        source = FileSource("FILE_NAME", use_env_var=True)
        assert source.get_value("test.hello", str) == "world"

    # Unset the environment variable
    del os.environ["FILE_NAME"]


def test_env_name_not_found_file_source():
    source = FileSource("MOCK_NAME", use_env_var=True)
    with pytest.raises(ValueError, match="Environment variable MOCK_NAME not found."):
        source.get_value("anything", str)


def test_env_source_file_missing():
    source = FileSource(file_path="wrong/path.json", required=True)
    with pytest.raises(FileNotFoundError):
        source.get_value("test", str)


def test_env_source_file_required_false():
    source = FileSource(file_path="wrong/path.json")
    with pytest.raises(KeyError, match="Key test not found in the source."):
        source.get_value("test", str)
