# Getting Started

reactivedataflow is a Python library for building reactive data processing graphs. It is designed to work with streaming data sources.

```sh
pip install reactivedataflow
```

The dependencies for this project include `rx`, `networkx`, and `pydantic`.

## Legacy
`reactivedataflow` has a design that is inspired by our prior work with [datashaper](https://github.com/microsoft/datashaper) and the neuron model of neural networks.
In a neural network, individual neurons are connected to other neurons through synapses. 
In traditional neural network topologies, there are "hidden" layers of normal neurons, in addition to special neurons that are designated as input neurons, and other neurons that are designated as output neurons.

In `reactivedataflow`, we have a similar conceptual framework of _Verb Nodes_, _Input Nodes_, and _Output Nodes_.

## Nodes
Nodes are the heart of the system, and they are responsible for processing data streams and emitting transformed results. A key feature of this system is that data streams between nodes are _polymorphic_ - meaning that they can be any type. Care should be taken that the processing function of a verb node is able to handle the data types that are passed to it.

#### Input Nodes

<img src="./images/input_node.png" height="300" title="Input Node"/>

Input nodes are simple nodes that are initialized with a `reactivex` event stream, and emit data on a single output port.

#### Output Nodes

<img src="./images/output_node.png" height="250" title="Output Node"/>

Output nodes are simple nodes that are used to observe the output of a verb node. They are initialized with a reference to a verb node, and emit data on a single output port. 
This is the primary mechanism for reading results from the processing graph.

#### Verb Nodes

<img src="./images/verb_node.png" height="350" title="Verb Node"/>

Verb nodes are composed of a number of "ports" that are used to describe their inputs, outputs, and configuration properties. 

* _Input ports_ represent data streams that are consumed by the verb node. Each message from an input port will result in a re-evaluation of the VerbNode's processing function, and may result in new messages being emitted on any number of output ports. 
* The _array input port_ is a special port type that allows for multiple input streams to be consumed by the verb node. This is useful for cases where multiple data streams are required to be processed together. When any of the input streams emit a message, the verb node will re-evaluate its processing function with the latest messages from all input streams.
* _Configuration_ ports are used to provide static configuration values, such as system services or algorithmic hyper-parameters, to the verb node. These values are used to parameterize the processing function, and are not expected to change during the lifetime of the verb node.
* _Output ports_ represent data streams that are emitted by the verb node. Each message emitted on an output port will be sent to any downstream nodes that are connected to the verb node via an input port.

## Edges
Edges are used to connect nodes together in a processing graph. They are used to define the flow of data between nodes, and are used to establish the dependencies between nodes. Each edge represents an event-based reactive datastream. Edges are attached to _two_ nodes. Edge properties may include:

* _from node_ (required) - the source node id of the data stream.
* _to node_ (required) - the destination node id of the data stream.
* _to_port_ - the name of the input port in the target node. If this is not provided it will be treated as an array input.
* _from_port_ - the name of the output port in the source node. If this is not provided it, we will use the _default output name_.