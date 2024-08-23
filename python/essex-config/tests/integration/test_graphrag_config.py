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
        "GRAPHRAG_CHUNKS_SIZE": "100",
        "GRAPHRAG_CHUNKS_OVERLAP": "12",
        "GRAPHRAG_CHUNKS_STRATEGY": '{"key": "valval"}',
        "GRAPHRAG_CHUNKS_ENCODING_MODEL": "model_xyz",
        "GRAPHRAG_SNAPSHOTS_GRAPHML": "false",
        "GRAPHRAG_SNAPSHOTS_RAW_ENTITIES": "1",
        "GRAPHRAG_SNAPSHOTS_TOP_LEVEL_NODES": "True",
        "GRAPHRAG_ENTITY_EXTRACTION_PROMPT": "c:\\some\\path\\to\\prompt",
        "GRAPHRAG_ENTITY_EXTRACTION_ENTITY_TYPES": "type1,type2",
        "GRAPHRAG_ENTITY_EXTRACTION_MAX_GLEANINGS": "123",
        "GRAPHRAG_ENTITY_EXTRACTION_STRATEGY": '{"key": "value"}',
        "GRAPHRAG_ENTITY_EXTRACTION_ENCODING_MODEL": "model_xyz",
        "GRAPHRAG_SUMMARIZE_DESCRIPTIONS_PROMPT": "c:\\some\\path\\to\\prompt",
        "GRAPHRAG_SUMMARIZE_DESCRIPTIONS_MAX_LENGTH": "123456",
        "GRAPHRAG_SUMMARIZE_DESCRIPTIONS_STRATEGY": '{"key": "value"}',
        "GRAPHRAG_COMMUNITY_REPORTS_PROMPT": "c:\\some\\path\\to\\prompt",
        "GRAPHRAG_COMMUNITY_REPORTS_MAX_LENGTH": "123456",
        "GRAPHRAG_COMMUNITY_REPORTS_MAX_INPUT_LENGTH": "1234567",
        "GRAPHRAG_COMMUNITY_REPORTS_STRATEGY": '{"key": "value"}',
        "GRAPHRAG_CLAIM_EXTRACTION_ENABLED": "True",
        "GRAPHRAG_CLAIM_EXTRACTION_PROMPT": "c:\\some\\path\\to\\prompt",
        "GRAPHRAG_CLAIM_EXTRACTION_DESCRIPTION": "A claim description",
        "GRAPHRAG_CLAIM_EXTRACTION_MAX_GLEANINGS": "123",
        "GRAPHRAG_CLAIM_EXTRACTION_STRATEGY": '{"key": "value"}',
        "GRAPHRAG_CLAIM_EXTRACTION_ENCODING_MODEL": "model_xyz",
        "GRAPHRAG_CLUSTER_GRAPH_MAX_CLUSTER_SIZE": "100",
        "GRAPHRAG_CLUSTER_GRAPH_STRATEGY": '{"key": "value123"}',
        "GRAPHRAG_UMAP_ENABLED": "1",
        "GRAPHRAG_LOCAL_SEARCH_TEXT_UNIT_PROP": "0.1",
        "GRAPHRAG_LOCAL_SEARCH_COMMUNITY_PROP": "0.2",
        "GRAPHRAG_LOCAL_SEARCH_CONVERSATION_HISTORY_MAX_TURNS": "10",
        "GRAPHRAG_LOCAL_SEARCH_TOP_K_MAPPED_ENTITIES": "5",
        "GRAPHRAG_LOCAL_SEARCH_TOP_K_RELATIONSHIPS": "5",
        "GRAPHRAG_LOCAL_SEARCH_TEMPERATURE": "0.5",
        "GRAPHRAG_LOCAL_SEARCH_TOP_P": "0.5",
        "GRAPHRAG_LOCAL_SEARCH_N": "10",
        "GRAPHRAG_LOCAL_SEARCH_MAX_TOKENS": "100",
        "GRAPHRAG_LOCAL_SEARCH_LLM_MAX_TOKENS": "1000",
        "GRAPHRAG_GLOBAL_SEARCH_TEMPERATURE": "0.5",
        "GRAPHRAG_GLOBAL_SEARCH_TOP_P": "0.5",
        "GRAPHRAG_GLOBAL_SEARCH_N": "10",
        "GRAPHRAG_GLOBAL_SEARCH_MAX_TOKENS": "100",
        "GRAPHRAG_GLOBAL_SEARCH_DATA_MAX_TOKENS": "12345",
        "GRAPHRAG_GLOBAL_SEARCH_MAP_MAX_TOKENS": "23456",
        "GRAPHRAG_GLOBAL_SEARCH_REDUCE_MAX_TOKENS": "34567",
        "GRAPHRAG_GLOBAL_SEARCH_CONCURRENCY": "10",
        "GRAPHRAG_PARALLELIZATION_STAGGER": "0.1",
        "GRAPHRAG_PARALLELIZATION_NUM_THREADS": "10",
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
    assert config.chunks.size == 100
    assert config.chunks.overlap == 12
    assert config.chunks.strategy == {"key": "valval"}
    assert config.chunks.encoding_model == "model_xyz"
    assert config.snapshots.graphml is False
    assert config.snapshots.raw_entities is True
    assert config.snapshots.top_level_nodes is True
    assert config.entity_extraction.prompt == "c:\\some\\path\\to\\prompt"
    assert config.entity_extraction.max_gleanings == 123
    assert config.entity_extraction.strategy == {"key": "value"}
    assert config.entity_extraction.encoding_model == "model_xyz"
    assert config.summarize_descriptions.prompt == "c:\\some\\path\\to\\prompt"
    assert config.summarize_descriptions.max_length == 123456
    assert config.summarize_descriptions.strategy == {"key": "value"}
    assert config.community_reports.prompt == "c:\\some\\path\\to\\prompt"
    assert config.community_reports.max_length == 123456
    assert config.community_reports.max_input_length == 1234567
    assert config.community_reports.strategy == {"key": "value"}
    assert config.claim_extraction.enabled is True
    assert config.claim_extraction.prompt == "c:\\some\\path\\to\\prompt"
    assert config.claim_extraction.description == "A claim description"
    assert config.claim_extraction.max_gleanings == 123
    assert config.claim_extraction.strategy == {"key": "value"}
    assert config.claim_extraction.encoding_model == "model_xyz"
    assert config.cluster_graph.max_cluster_size == 100
    assert config.cluster_graph.strategy == {"key": "value123"}
    assert config.umap.enabled is True
    assert config.local_search.text_unit_prop == 0.1
    assert config.local_search.community_prop == 0.2
    assert config.local_search.conversation_history_max_turns == 10
    assert config.local_search.top_k_entities == 5
    assert config.local_search.top_k_relationships == 5
    assert config.local_search.temperature == 0.5
    assert config.local_search.top_p == 0.5
    assert config.local_search.n == 10
    assert config.local_search.max_tokens == 100
    assert config.local_search.llm_max_tokens == 1000
    assert config.global_search.temperature == 0.5
    assert config.global_search.top_p == 0.5
    assert config.global_search.n == 10
    assert config.global_search.max_tokens == 100
    assert config.global_search.data_max_tokens == 12345
    assert config.global_search.map_max_tokens == 23456
    assert config.global_search.reduce_max_tokens == 34567
    assert config.global_search.concurrency == 10
    assert config.parallelization.stagger == 0.1
    assert config.parallelization.num_threads == 10

    assert config.entity_extraction.entity_types == ["type1", "type2"]

    assert config.embeddings.skip == ["skip1", "skip2"]

    assert config.input.document_attribute_columns == ["attr1", "attr2"]

    assert config.skip_workflows == ["workflow1", "workflow2"]
