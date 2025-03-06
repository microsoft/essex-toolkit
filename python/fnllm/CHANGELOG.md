# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Unreleased Template
```md
## [Unreleased]
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
```
## [Unreleased]
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [0.2.4] - 2025-03-06
### Added
- Add `InvalidLLMResultError` and ``OpenAINoChoicesAvailableError`, which are raised when the LLM returns an invalid result or no choices are available; these are included in the retry logic.
- Add reasoning effort to chat model parameters.
### Changed
- Use module-level logger in LLMEventsLogger.
- Only create a single-instance of retryable error tuple.

## [0.2.3] - 2025-02-17
### Added
- Add `cache_bust` flag to LLMInput.
### Fixed
- Handle `bypass_cache` flag in Cached decorator.

## [0.2.2] - 2025-02-17
### Added
- Adding `max_completion_tokens` to `OpenAIChatParameters`.
- Add `Cached` decorator to handle LLM caching.
### Changed
- Log out all LLM events to either DEBUG, WARN, or ERROR to reduce default log volume.
### Fixed
- Fix issue where cached JSON responses were not parsed by JsonReceiver.

## [0.2.1] - 2025-02-14
### Fixed
- Fixed token estimation.
### Added
- Added support to `is_reasoning_model` to the base `LLM`, supporting o1, o1-mini and o3-mini.

## [0.2.0] - 2025-02-12
### Added
- Add LLM Events:
	- `on_recover_from_error`
	- `on_non_retryable_error`
- Add `JsonMode.None` to disable JSON Mode, and avoid adding the JsonReceiver decorator.
### Changed
- Don't decorate with RateLimiter if no throttles defined.
### Removed
- Remove deprecate strategy RetryStrategy.TENACITY, use RetryStrategy.EXPONENTIAL_BACKOFF instead.
### Fixed
- Clean up internal `Retryer` logic.
- Bypass `Retryer` decorator when `retry_strategy` is set to `None`.
* Make timeout required, and set to 180s by default to avoid network timeouts from hanging processes.

## [0.1.2] - 2025-02-10
### Added
- Add new RetryStrategy enum values:
	* `RetryStrategy.EXPONENTIAL_BACKOFF` (default strategy) - for exponential backoff wait times 
	* `RetryStrategy.RANDOM_WAIT` - for random wait times between `[0, config.max_wait]`.
	* `RetryStrategy.INCREMENTAL_WAIT` - for linear incremental wait times between `[0, config.max_wait]`.

### Deprecated
- Deprecate `RetryStrategy.TENACITY` in favor of `RetryStrategy.EXPONENTIAL_BACKOFF`.

### Fixed
* Fix issue with TPM Limiter where requests with tokens > tokens_per_minute limit would automatically fail.

## [0.1.1] - 2025-02-07
### Added
* Add `fnllm.utils.batch` to support generalized batch processing.
* Add `fnllm.openai.llm.openai_embeddings_batcher`, which allows for singular embeddings calls to be called in batches.
* Add `fnllm.openai.services.openai_text_service`, which is a general utility for splitting, counting, encoding and decoding text.
* Add `cache_hit` property to LLMOutput.

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
