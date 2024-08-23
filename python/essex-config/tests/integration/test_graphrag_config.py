import os
from unittest import mock

from essex_config.sources import EnvSource

from .graphrag_config import GraphRagConfig


def test_graphrag_config_defaults():
    config = GraphRagConfig.load_config()
    assert config.root_dir == "."


@mock.patch.dict(
    os.environ,
    {
        "GRAPHRAG_ROOT_DIR": "root",
        "GRAPHRAG_ENCODING_MODEL": "model_xyz",
        "GRAPHRAG_SKIP_WORKFLOWS": "workflow1,workflow2",
    },
    clear=True,
)
def test_graphrag_config_env_vars():
    config = GraphRagConfig.load_config(sources=[EnvSource()])
    assert config.root_dir == "root"
    assert config.encoding_model == "model_xyz"
    assert config.skip_workflows == ["workflow1", "workflow2"]
