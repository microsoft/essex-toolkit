# Examples

## Simple Example
The first task in using `reactivedataflow` is to define your relevant processing verbs.  
Processing verbs are _pure functions_ that are annotated using the `@verb` decorator and the `Annotated` feature. 
A key feature of `reactivedataflow` is that verb functions _are not explicitly coupled_ to reactivedataflow, and may be used in other contexts as well.

```python
from reactivedataflow import verb, Input, Config
from typing import Annotated

@verb(name="print")
def print_verb(
	val: Annotated[str, Input()], 
	prefix: Annotated[str, Config()] = ""
) -> str:
	return f"{prefix}{val}"
```

Once we have a set of verbs defined, we can define a processing graph to establish a dataflow. 
In this example, we'll load a simple one-node graph using the `Graph` schema. 
The `GraphBuilder` also has a builder-mode API so that graphs can be defined iteratively.

```python
import reactivex as rx
from reactivedataflow import (
	GraphBuilder,
	Graph,
	InputNode,
	Node,
	Edge,
	Output
)

#
# Define a simple graph
#
graph = GraphBuilder().load_model(
	Graph(
		inputs=[InputNode(id="input")],
		nodes=[Node(id="printed", verb="print", config={"prefix": "!"})],
		edges=[Edge(from_node="input", to_node="printed")],
		outputs=[Output(name="result", node="printed")],
	)
).build(
	inputs={
		"input": rx.of(["hello", "world"]),
	}
)
graph.output("result").subscribe(print)
# Output: 
# !hello
# !world
```

## Math Operators
```python    

@verb("add")
def add(
	values: Annotated[list[int], ArrayInput(min_inputs=1, defined_inputs=True)],
) -> int:
	return sum(values)

@verb("multiply")
def multiply(a: Annotated[int, Input()], b: Annotated[int, Input()]) -> int:
	return a * b

@verb("constant")
def constant(value: Annotated[int, Config()]) -> int:
	return value

graph = GraphBuilder().load_model(
	Graph(
		inputs=[
			InputNode(id="input"),
		],
		nodes=[
			Node(id="c3", verb="constant", config={"value": 3}),
			Node(id="c5", verb="constant", config={"value": ValRef(value=5)}),
			Node(id="first_add", verb="add"),
			Node(id="second_add", verb="add"),
			Node(id="product", verb="multiply"),
		],
		edges=[
			# First sum inputs: 1 + 3 = 4
			Edge(from_node="input", to_node="first_add"),
			Edge(from_node="c3", to_node="first_add"),
			# Second sum inputs: 5 + 3 = 8
			Edge(from_node="c3", to_node="second_add"),
			Edge(from_node="c5", to_node="second_add"),
			# Multiply the sums: 4 * 8 = 32
			Edge(from_node="first_add", to_node="product", to_port="a"),
			Edge(from_node="second_add", to_node="product", to_port="b"),
		],
		outputs=[Output(name="result", node="product")],
	)
).build(
	inputs={
		"input": rx.of([1]),
	}
)
graph.output("result").subscribe(print)
# Output: 32
```

## Math Operators using Builder API

```python
# Assemble a graph:
#
#  n1 ----\
#         n3
#  n2 ----/
#
graph = GraphBuilder()
	# Define Constant Layer
	.add_node("c1", "constant", config={"value": 1})
	.add_node("c3", "constant", config={"value": 3})
	.add_node("c5", "constant", config={"value": 5})
	# Define Execution Layer
	.add_node("n1", "add")
	.add_edge(from_node="c1", to_node="n1")
	.add_edge(from_node="c3", to_node="n1")
	.add_node("n2", "add")
	.add_edge(from_node="c3", to_node="n2")
	.add_edge(from_node="c5", to_node="n2")
	.add_node("n3", "multiply")
	.add_edge(from_node="n1", to_node="n3", to_port="a")
	.add_edge(from_node="n2", to_node="n3", to_port="b")
	.add_output("result", "n3")
	.build()
```