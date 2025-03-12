# Verbs

Verbs are at the heart of `reactivedataflow`. Verbs are custom processing functions that react to input event streams and emit output event streams. Verbs are normally defined using _pure functions_ which are annotated using the `@verb` decorator and the `Annotated` feature. This mechanism allows verbs to be used in other contexts as well, not just `reactivedataflow`, improving their utility and testability.

At a base level, the system treats each verb as a function that accepts a `VerbInput` and returns a `VerbOutput`. The `verb` decorator and related annotations provide convenience mechanisms for adapting pure functions to fit into the execution model.

## Annotated Verbs (recommended)
```python
from reactivedataflow import verb, Input
from typing import Annotated

@verb("add")
def add(
	a: Annotated[int, Input()], 
	b: Annotated[int, Input()]
) -> int:
	return a + b
```
Input Options:

* `required` _(bool, default=?)_: Whether this input is required. This is inferred from whether the argument has a default value.

## Raw Verbs
```python
from reactivedataflow import verb, VerbInput, VerbOutput, InputMode, OutputMode

@verb(
	name="add", 
	input_mode=InputMode.Raw, 
	output_mode=OutputMode.Raw
)
def add(input: VerbInput) -> VerbOutput:
	return {"result": input["a"] + input["b"]}
```

## Using Array Inputs
```python
from reactivedataflow import verb, ArrayInput
from typing import Annotated

@verb("add")
def add(
	inputs: Annotated[list[int], ArrayInput(min_inputs=2)]
) -> int:
	return sum(inputs)
```

Array Input Options:

* `required` _(bool, default=?)_: Whether this input is required. This is inferred from whether the argument has a default value.
* `min_inputs` _(int, default=None)_: The minimum number of inputs that must be provided to the verb node.
* `defined_inputs` _(bool, default=False)_: If true, then each array value must be non-None for the verb to fire.

## Using Explicit Port Definitions
As an alternative to decorating function arguments, ports may be defined explicitly. 
Each port has a name and maps into a parameter name.

```python
from reactivedataflow import verb, Input, Config

@verb(
	"add",
	ports=[
		Input(name="input_1", parameter="x", required=True),
		Input(name="input_2", parameter="y", required=True),
		Config(name="config", parameter="z", required=False),
		Output(name="output"),
	]
)
def add(x: int, y: int, z: int = 0) -> int:
	return x + y + z
```

## Emitting Multiple Outputs
When multiple outputs are desired, you can set the `output_mode` to `OutputMode.Tuple` and provide a list of output port names.

```python
@verb(
	"twin_outputs",
	output_names=["output_1", "output_2"],
	output_mode=OutputMode.Tuple,
)
def twin_outputs(
	x: Annotated[str | None, Input()], 
	y: Annotated[str | None, Input()]
) -> tuple[str, str]:
	output_1 = f"{x} {y}"
	output_2 = f"{y} {x}"
	return output_1, output_2
```

## Using a Custom Registry
There may be cases where you want to separate verb definitions from each other. This is most often used in testing. In these cases, verbs can be initialized with a custom registry instance. By default, a singleton registry is used.

```python
from reactivedataflow import verb, Input, Config, VerbRegistry

registry = VerbRegistry()
@verb("add", registry=registry)
...
```
## Overriding a Defined Verb
Verbs are registered as their Python files are loaded. In situations where you need to override a verb definition, you can use the `override` parameter.

```python
from reactivedataflow import verb, Input, Config, VerbRegistry

registry = VerbRegistry()
@verb("add", override=True)
...
```

## Adding Custom Adapters
You can register decorator functions that are applied _before_ any `reactivedataflow` decoration is applied. This is useful for adding custom behavior to verbs.

```python
from reactivedataflow import verb, Input, Config

def emit_telemetry(fn):
	def wrap_fn():
		print(f"Calling {fn.__name__}")
		return fn()
	return wrap_n

@verb("add", adapters=[emit_telemetry])
def add(
	a: Annotated[int, Input()], 
	b: Annotated[int, Input()]
) -> int:
	return a + b
```
## Overriding a Defined Verb
Verbs are registered as their Python files are loaded. In situations where you need to override a verb definition, you can use the `override` parameter.

```python
from reactivedataflow import verb, Input, Config, VerbRegistry

registry = VerbRegistry()
@verb("add", override=True)
...
```

## Fire/Emit Conditions
The `verb` API allows for users to define _firing_ and _emitting_ conditions. 
These are predicate functions that operate on `VerbInput` and `VerbOutput` objects. 

```python
from reactivedataflow import verb, Input, Config, VerbCondition, VerbInput

def fire_condition(input: VerbInput) -> bool:
	return input["a"] > 0

def emit_condition(input: VerbInput, output: VerbOutput) -> bool:
	return output["result"] > 0

@verb(
	"add", 
	fire_conditions=[fire_condition],
	emit_conditions=[emit_condition]
)
def add(
	a: Annotated[int, Input()], 
	b: Annotated[int, Input()]
) -> int:
	return a + b
```

