# Development Instructions


## JavaScript

### Prerequisites
* Node LTS (20+)
* Yarn (npm i -g yarn)

### Setup
To install the dependencies across the project, run this command at the top level. This will ensure that all dependencies are loaded, and that tests can be run across all JavaScript projects.
```sh
yarn
```

Available tasks are listed in `package.json` under the `scripts` section. You can run them using `yarn <task>`.

## Python

### Prerequisites

* Python 3.10+
* [uv](https://docs.astral.sh/uv/getting-started/installation/)

### Setup
To install the dependencies across the project, run this command at the top level. This will ensure that all dependencies are loaded, and that tests can be run across all Python projects.
```sh
uv sync --all-packages
```

### Common Development Scripts
The following scripts are available per python project, and can be run in their respective package folders.

* **Run tests**

		uv run poe test

* **Run tests with coverage**

		uv run poe test_coverage

* **Run static checks**

		uv run poe check

* **Perform automated fixes**

		uv run poe fix

* **Perform unsafe automated fixes**

		uv run poe fix_unsafe

* **Format the code**

		uv run poe format
