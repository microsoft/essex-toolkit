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

## [0.3.1] - 2025-07-18
### Added
- Add configuration for `special_token_behavior` to control how special tokens are handled in prompts.
### Fixed
- Fix issue with OpenAIStreamingChatLLM when `delta` is not present in the response.
- Handle race conditions via error suppression in Azure Blob-Storage cache.
- Use `tiktoken.Encoding.encode_ordinary` for encoding text to avoid issues with special tokens such as `<|endoftext|>`.

## [0.3.0] - 2025-04-09
### Added
- Add HTTP header reactive updates to TPM/RPM throttles. By setting tpm or rpm to 'auto', the throttle will be started in dynamic mode.
- Add events method for limit reconciliation.
- Add `config.rate_limit_behavior` to control how we react to OpenAI rate limiting errors.
### Changed
- Update OpenAIRetryableErrorHandle to inspect error headers instead of the error message.
### Removed
- Remove `config.sleep_on_rate_limit_recommendation`.

## [0.2.9] - 2025-04-07
### Fixed
- Update EmbeddingBatcher to emit a None-Future when embedding input is empty.

## [0.2.8] - 2025-03-21
### Fixed
- Add default base implementation for `cache.sweep` to avoid breaking changes.

## [0.2.7] - 2025-03-21
### Fixed
- Add inflight cache collision prevention.

## [0.2.6] - 2025-03-20
### Added
- Add `cache.sweep` function to remove expired cache entries.
- Allow user-defined cache entry metadata.
- Add cache key to entry metadata.

## [0.2.5] - 2025-03-07
### Fixed
- Resolve circular import, remove `OpenAINoChoicesAvailableError` from top-level errors.
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
