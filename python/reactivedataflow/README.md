# Reactive-Dataflow
Reactive Processing Graphs for Python.


# Getting Started

## Installation 
```sh
pip install reactivedataflow
```

The key dependencies for this project include `rx` and `networkx`. These are outlined in the `pyproject.toml` dependencies section.

## Usage

```python
import reactivex as rx
from reactivedataflow import (
	GraphAssembler, 
	GraphModel, 
	VerbNodeModel, 
	InputNodeModel, 
	InputModel,
	verb,
	InputPort,
	ConfigPort
)
#
# Define a processing verb
#
@verb(
	name="print",
	ports=[
		InputPort(name="values", required=True, parameter="val"),
		ConfigPort(name="prefix", required=False, parameter="prefix"),
	]
)
def print_verb(val, prefix=""):
	return f"{prefix}{val}"

#
# Define a simple graph
#
assembler = GraphAssembler()
assembler.load(
	GraphModel(
		inputs=[
			# This is an input stream of values we'll define on build
			InputNodeModel(id="input_values")
		],
		nodes=[
			# Here we define the processing nodes
			VerbNodeModel(
				id="verb1",
				verb="print",
				config={"prefix": "emitted: "},
				input={
					"values": InputModel(node="input_values")
				}
			),
		],
	),
)

#
# Build the graph and bind input streams
#
graph = assembler.build(
	inputs={
		"input_values": rx.of([1, 2, 3])
	}
)
#
# Watch graph outputs
#
graph.output("verb1").subscribe(print)
# Output:
# emitted: 1
# emitted: 2
# emitted: 3
```

## Developing

This project uses [`poetry`](https://python-poetry.org/) for dependency management. You should have a recent Python version (e.g. 3.10+) and Poetry 1.8+ installed on your system.

```sh
# Install dependencies
poetry install

# Run tests
poetry run poe test

# Run static checks
poetry run poe check
```
