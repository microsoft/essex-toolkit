import os
from pathlib import Path
from unittest import mock

import pytest

from essex_config.sources import FileSource


def test_json_source():
    mock_data = '{"TEST_VALUE": "test_value"}'
    with mock.patch("pathlib.Path.open", mock.mock_open(read_data=mock_data)):
        source = FileSource(Path("dummy.json"))
        assert source.get_data() == {"TEST_VALUE": "test_value"}

        assert str(source) == "FileSource(file_path=dummy.json)"
        assert repr(source) == "FileSource(file_path=dummy.json)"
        assert source.__rich__() == "FileSource(file_path=dummy.json)"


def test_str_file_source():
    mock_data = '{"TEST_VALUE": "test_value"}'
    with mock.patch("pathlib.Path.open", mock.mock_open(read_data=mock_data)):
        source = FileSource("dummy.json")
        assert source.get_data() == {"TEST_VALUE": "test_value"}


def test_toml_source():
    mock_data = b"""[test]
    hello = "world" """
    with mock.patch("pathlib.Path.open", mock.mock_open(read_data=mock_data)):
        source = FileSource(Path("dummy.toml"))
        assert source.get_data()["test"]["hello"] == "world"


def test_yaml_source():
    mock_data = b"""test:
      hello: world"""
    with mock.patch("pathlib.Path.open", mock.mock_open(read_data=mock_data)):
        source = FileSource(Path("dummy.yaml"))
        assert source.get_data()["test"]["hello"] == "world"


def test_unknown_file_source():
    source = FileSource(Path("dummy.txt"))
    with pytest.raises(ValueError, match="File type .txt not supported."):
        source.get_data()


def test_env_name_file_source():
    # Set the environment variable
    os.environ["FILE_NAME"] = "my_file.yml"

    mock_data = b"""test:
      hello: world"""

    with mock.patch("pathlib.Path.open", mock.mock_open(read_data=mock_data)):
        source = FileSource("FILE_NAME", use_env_var=True)
        assert source.get_data()["test"]["hello"] == "world"

    # Unset the environment variable
    del os.environ["FILE_NAME"]


def test_env_name_not_found_file_source():
    source = FileSource("MOCK_NAME", use_env_var=True)
    with pytest.raises(ValueError, match="Environment variable MOCK_NAME not found."):
        source.get_data()
