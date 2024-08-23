import os
from unittest import mock

from essex_config.sources import EnvSource

from .graphrag_config import (
    CacheType,
    GraphRagConfig,
    ReportingType,
    StorageType,
    TextEmbeddingTarget,
)


def test_graphrag_config_defaults():
    config = GraphRagConfig.load_config()
    assert config.root_dir == "."


@mock.patch.dict(
    os.environ,
    {
        "GRAPHRAG_ROOT_DIR": "root",
        "GRAPHRAG_ENCODING_MODEL": "model_xyz",
        "GRAPHRAG_SKIP_WORKFLOWS": "workflow1,workflow2",
        "GRAPHRAG_REPORTING_TYPE": "console",
        "GRAPHRAG_REPORTING_BASE_DIR": "/some/base/dir",
        "GRAPHRAG_REPORTING_CONNECTION_STRING": "cs://report",
        "GRAPHRAG_REPORTING_CONTAINER_NAME": "reportingcontainer",
        "GRAPHRAG_REPORTING_STORAGE_ACCOUNT_BLOB_URL": "https://reporting.blob.url",
        "GRAPHRAG_STORAGE_TYPE": "blob",
        "GRAPHRAG_STORAGE_BASE_DIR": "/some/base/dir",
        "GRAPHRAG_STORAGE_CONNECTION_STRING": "cs://storage",
        "GRAPHRAG_STORAGE_CONTAINER_NAME": "storagecontainer",
        "GRAPHRAG_STORAGE_STORAGE_ACCOUNT_BLOB_URL": "https://storage.blob.url",
        "GRAPHRAG_CACHE_TYPE": "blob",
        "GRAPHRAG_CACHE_BASE_DIR": "/some/base/dir",
        "GRAPHRAG_CACHE_CONNECTION_STRING": "cs://cache",
        "GRAPHRAG_CACHE_CONTAINER_NAME": "cachecontainer",
        "GRAPHRAG_CACHE_STORAGE_ACCOUNT_BLOB_URL": "https://cache.blob.url",
        "GRAPHRAG_INPUT_TYPE": "blob",
        "GRAPHRAG_INPUT_FILE_TYPE": "csv",
        "GRAPHRAG_INPUT_BASE_DIR": "/some/base/dir",
        "GRAPHRAG_INPUT_CONNECTION_STRING": "cs://input",
        "GRAPHRAG_INPUT_CONTAINER_NAME": "inputcontainer",
        "GRAPHRAG_INPUT_STORAGE_ACCOUNT_BLOB_URL": "https://input.blob.url",
        "GRAPHRAG_INPUT_ENCODING": "utf-8",
        "GRAPHRAG_INPUT_FILE_PATTERN": "*.csv",
        "GRAPHRAG_INPUT_TEXT_COLUMN": "text",
        "GRAPHRAG_INPUT_TITLE_COLUMN": "title",
        "GRAPHRAG_INPUT_DOCUMENT_ATTRIBUTE_COLUMNS": "attr1,attr2",
        "GRAPHRAG_EMBED_GRAPH_ENABLED": "true",
        "GRAPHRAG_EMBED_GRAPH_NUM_WALKS": "10",
        "GRAPHRAG_EMBED_GRAPH_WALK_LENGTH": "11",
        "GRAPHRAG_EMBED_GRAPH_WINDOW_SIZE": "12",
        "GRAPHRAG_EMBED_GRAPH_ITERATIONS": "123",
        "GRAPHRAG_EMBED_GRAPH_RANDOM_SEED": "0xDEADBEEF",
        "GRAPHRAG_EMBED_GRAPH_STRATEGY": '{"key": "value"}',
        "GRAPHRAG_EMBEDDINGS_BATCH_SIZE": "100",
        "GRAPHRAG_EMBEDDINGS_BATCH_MAX_TOKENS": "5_000",
        "GRAPHRAG_EMBEDDINGS_TARGET": "all",
        "GRAPHRAG_EMBEDDINGS_SKIP": "skip1,skip2",
        "GRAPHRAG_EMBEDDINGS_VECTOR_STORE": '{"key": "valuex"}',
        "GRAPHRAG_EMBEDDINGS_STRATEGY": '{"key": "valval"}',
    },
    clear=True,
)
def test_graphrag_config_env_vars():
    config = GraphRagConfig.load_config(sources=[EnvSource()])
    assert config.root_dir == "root"
    assert config.encoding_model == "model_xyz"
    assert config.reporting.type == ReportingType.console
    assert config.reporting.base_dir == "/some/base/dir"
    assert config.reporting.connection_string == "cs://report"
    assert config.reporting.container_name == "reportingcontainer"
    assert config.reporting.storage_account_blob_url == "https://reporting.blob.url"
    assert config.storage.type == StorageType.blob
    assert config.storage.base_dir == "/some/base/dir"
    assert config.storage.connection_string == "cs://storage"
    assert config.storage.container_name == "storagecontainer"
    assert config.cache.type == CacheType.blob
    assert config.cache.base_dir == "/some/base/dir"
    assert config.cache.connection_string == "cs://cache"
    assert config.cache.container_name == "cachecontainer"
    assert config.cache.storage_account_blob_url == "https://cache.blob.url"
    assert config.input.type == "blob"
    assert config.input.file_type == "csv"
    assert config.input.base_dir == "/some/base/dir"
    assert config.input.connection_string == "cs://input"
    assert config.input.container_name == "inputcontainer"
    assert config.input.storage_account_blob_url == "https://input.blob.url"
    assert config.input.encoding == "utf-8"
    assert config.input.file_pattern == "*.csv"
    assert config.input.text_column == "text"
    assert config.input.title_column == "title"
    assert config.embed_graph.enabled is True
    assert config.embed_graph.num_walks == 10
    assert config.embed_graph.walk_length == 11
    assert config.embed_graph.window_size == 12
    assert config.embed_graph.iterations == 123
    assert config.embed_graph.strategy == {"key": "value"}
    assert config.embed_graph.random_seed == 0xDEADBEEF
    assert config.embeddings.batch_size == 100
    assert config.embeddings.batch_max_tokens == 5000
    assert config.embeddings.target == TextEmbeddingTarget.all
    assert config.embeddings.vector_store == {"key": "valuex"}
    assert config.embeddings.strategy == {"key": "valval"}

    assert config.embeddings.skip == ["skip1", "skip2"]

    assert config.input.document_attribute_columns == ["attr1", "attr2"]

    assert config.skip_workflows == ["workflow1", "workflow2"]
