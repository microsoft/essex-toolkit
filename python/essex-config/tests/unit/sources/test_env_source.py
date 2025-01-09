import os
import re
from pathlib import Path
from unittest import mock

import pytest
from essex_config.sources import EnvSource


@pytest.fixture
def _mock_env_vars():
    with mock.patch.dict(
        os.environ,
        {"TEST_VALUE": "test_value", "TEST_FILE": "tests/.env.test", "TEST_INT": "1"},
        clear=True,
    ):
        yield


@pytest.mark.usefixtures("_mock_env_vars")
def test_env_source():
    source = EnvSource()

    assert source.get_value("TEST_VALUE", str) == "test_value"
    assert source.get_value("TEST_INT", int) == 1
    assert str(source) == "EnvSource()"


@pytest.mark.usefixtures("_mock_env_vars")
def test_not_found():
    source = EnvSource()

    assert "NOT_FOUND" not in source

    with pytest.raises(KeyError, match=r"Key NOT_FOUND not found in the source."):
        source.get_value("NOT_FOUND", str)


def test_env_source_file():
    source = EnvSource(file_path="tests/.env.test")

    assert source.get_value("TEST_VALUE", str) == "test value"
    assert str(source) == "EnvSource()"


@pytest.mark.usefixtures("_mock_env_vars")
def test_env_source_file_from_env():
    source = EnvSource(file_path="TEST_FILE", use_env_var=True)

    assert source.get_value("TEST_VALUE", str) == "test value"
    assert str(source) == "EnvSource()"


def test_env_source_file_invalid_file():
    wrong_file_path = Path("wrong/.env.test")
    source = EnvSource(file_path=wrong_file_path, required=True)
    with pytest.raises(
        FileNotFoundError, match=re.escape(f"File {wrong_file_path!s} not found.")
    ):
        source.get_value("TEST_VALUE", str)


def test_env_source_file_required_false():
    source = EnvSource(file_path="wrong/.env.test")
    with pytest.raises(KeyError):
        source.get_value("TEST_VALUE", str)
