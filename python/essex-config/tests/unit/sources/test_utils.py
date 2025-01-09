import os
from pathlib import Path
from unittest import mock

import pytest
from essex_config.sources.utils import path_from_variable


@pytest.fixture
def _mock_env_vars():
    with mock.patch.dict(os.environ, {"TEST_VALUE": "test_value"}, clear=True):
        yield


@pytest.mark.usefixtures("_mock_env_vars")
def test_path_from_env():
    path = path_from_variable("TEST_VALUE")

    assert isinstance(path, Path)
    assert path == Path("test_value")


@pytest.mark.usefixtures("_mock_env_vars")
def test_path_from_missing_env_var():
    with pytest.raises(ValueError, match=r"Environment variable NOT_FOUND not found."):
        path_from_variable("NOT_FOUND")
