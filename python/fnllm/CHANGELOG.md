# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [0.1.1] - 2025-02-07
### Added
* Add `fnllm.utils.batch` to support generalized batch processing.
* Add `fnllm.openai.llm.openai_embeddings_batcher`, which allows for singular embeddings calls to be called in batches.
* Add `fnllm.openai.services.openai_text_service`, which is a general utility for splitting, counting, encoding and decoding text.
### Changed
* Move `fnllm.services` to `fnllm.base.services`
* Move `fnllm.config` to `fnllm.base.config`
* Move `fnllm.openai.llm.services` to `fnllm.openai.services`
* Add `fnllm.enums` to re-export common enumerations.
* Streamline JSON Mode object model.

## [0.1.0] - 2025-02-05

### Added
- Add config option `retry_strategy`, which may be used to opt-out of Tenacity's retry strategy and rely on the underlying library instead (e.g. OpenAI's retry logic).

### Changed
* Rename `cognitive_services_endpoint` configuration key to `audience`.

### Removed

## [0.0.18] - 2025-01-27
## Added
- Add correct license metadata.