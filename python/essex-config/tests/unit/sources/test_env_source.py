import os
from unittest import mock

import pytest

from essex_config.sources import EnvSource


@pytest.fixture()
def _mock_env_vars():
    with mock.patch.dict(
        os.environ, {"TEST_VALUE": "test_value", "TEST_INT": "1"}, clear=True
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

    with pytest.raises(KeyError, match="Key NOT_FOUND not found in the environment."):
        source.get_value("NOT_FOUND", str)
