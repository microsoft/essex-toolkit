# Developing reactivedataflow

## Prerequisites

* Python 3.10+
* [uv](https://docs.astral.sh/uv/getting-started/installation/)

## Development Scripts

```sh
# Install dependencies
uv sync

# Run tests
uv run poe test

# Run tests with coverage
uv run poe test_coverage

# Run static checks
uv run poe check

# Perform automated fixes
uv run poe fix

# Perform unsafe automated fixes
uv run poe fix_unsafe

# Format the code
uv run poe format
```
