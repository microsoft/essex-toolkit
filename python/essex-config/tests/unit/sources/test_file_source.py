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
    with pytest.raises(ValueError, match="File type .txt not supported."):
        FileSource(Path("dummy.txt")).get_data()
