# Developing reactivedataflow

## Prerequisites

* Python 3.10+
* [Poetry 1.8+](https://python-poetry.org/)

## Development Scripts

```sh
# Install dependencies
poetry install

# Run tests
poetry run poe test

# Run tests with coverage
poetry run poe test_coverage

# Run static checks
poetry run poe check

# Perform automated fixes
poetry run poe fix

# Perform unsafe automated fixes
poetry run poe fix_unsafe

# Format the code
poetry run poe format
```
