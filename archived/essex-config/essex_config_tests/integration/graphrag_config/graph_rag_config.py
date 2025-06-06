# Copyright (c) 2025 Microsoft Corporation.
# Licensed under the MIT License

"""Parameterization settings for the default configuration."""

from typing import Annotated

from essex_config.field_annotations import Parser
from essex_config.sources.utils import plain_text_list_parser
from pydantic import Field

import essex_config_tests.integration.graphrag_config.defaults as defs

from .chunking_config import ChunkingConfig
from .claim_extraction_config import ClaimExtractionConfig
from .cluster_graph_config import ClusterGraphConfig
from .embed_graph_config import EmbedGraphConfig
from .entity_extraction_config import EntityExtractionConfig
from .global_search_config import GlobalSearchConfig
from .input_config import InputConfig
from .llm_config import LLMConfig
from .reporting_config import ReportingConfig
from .snapshots_config import SnapshotsConfig
from .summarize_descriptions_config import SummarizeDescriptionsConfig
from .text_embedding_config import TextEmbeddingConfig


class GraphRagConfig(LLMConfig):
    """Base class for the Default-Configuration parameterization settings."""

    def __str__(self):
        """Get a string representation."""
        return self.model_dump_json(indent=4)

    root_dir: str = Field(
        description="The root directory for the configuration.", default=defs.ROOT_DIR
    )

    encoding_model: str = Field(
        description="The encoding model to use.", default=defs.ENCODING_MODEL
    )
    """The encoding model to use."""

    skip_workflows: Annotated[list[str], Parser(plain_text_list_parser())] = Field(
        description="The workflows to skip, usually for testing reasons.", default=[]
    )
    """The workflows to skip, usually for testing reasons."""

    reporting: ReportingConfig = Field(
        description="The reporting configuration.", default=ReportingConfig()
    )
    """The reporting configuration."""

    input: InputConfig = Field(
        description="The input configuration.", default=InputConfig()
    )
    """The input configuration."""

    embed_graph: EmbedGraphConfig = Field(
        description="Graph embedding configuration.",
        default=EmbedGraphConfig(),
    )
    """Graph Embedding configuration."""

    embeddings: TextEmbeddingConfig = Field(
        description="The embeddings LLM configuration to use.",
        default=TextEmbeddingConfig(),
    )
    """The embeddings LLM configuration to use."""

    chunks: ChunkingConfig = Field(
        description="The chunking configuration to use.",
        default=ChunkingConfig(),
    )
    """The chunking configuration to use."""

    snapshots: SnapshotsConfig = Field(
        description="The snapshots configuration to use.",
        default=SnapshotsConfig(),
    )
    """The snapshots configuration to use."""

    entity_extraction: EntityExtractionConfig = Field(
        description="The entity extraction configuration to use.",
        default=EntityExtractionConfig(),
    )
    """The entity extraction configuration to use."""

    summarize_descriptions: SummarizeDescriptionsConfig = Field(
        description="The description summarization configuration to use.",
        default=SummarizeDescriptionsConfig(),
    )
    """The description summarization configuration to use."""

    claim_extraction: ClaimExtractionConfig = Field(
        description="The claim extraction configuration to use.",
        default=ClaimExtractionConfig(
            enabled=defs.CLAIM_EXTRACTION_ENABLED,
        ),
    )
    """The claim extraction configuration to use."""

    cluster_graph: ClusterGraphConfig = Field(
        description="The cluster graph configuration to use.",
        default=ClusterGraphConfig(),
    )
    """The cluster graph configuration to use."""

    global_search: GlobalSearchConfig = Field(
        description="The global search configuration.", default=GlobalSearchConfig()
    )
    """The global search configuration."""
