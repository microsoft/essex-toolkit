import os
from unittest import mock

from .graphrag_config import GraphRagConfig


def test_graphrag_config_defaults():
    config = GraphRagConfig.load_config()
    assert config.root_dir == "."


@mock.patch.dict(
    os.environ,
    {"GRAPHRAG_ROOT_DIR": "root"},
    clear=True,
)
def test_graphrag_config_env_vars():
    config = GraphRagConfig.load_config()
    assert config.root_dir == "root"
