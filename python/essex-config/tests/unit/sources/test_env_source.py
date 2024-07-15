import os
from unittest import mock

import pytest

from essex_config.sources import EnvSource


@pytest.fixture()
def _mock_env_vars():
    with mock.patch.dict(os.environ, {"TEST_VALUE": "test_value"}, clear=True):
        yield


@pytest.mark.usefixtures("_mock_env_vars")
def test_env_source():
    source = EnvSource()

    assert source.get_data()["TEST_VALUE"] == "test_value"
    assert str(source) == "EnvSource()"
