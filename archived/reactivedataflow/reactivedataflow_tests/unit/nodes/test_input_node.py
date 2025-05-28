# Copyright (c) 2025 Microsoft Corporation.
"""Tests for the InputNode class."""

import reactivex as rx
from reactivedataflow.nodes import InputNode


def test_input_node_has_id():
    node = InputNode("a")
    assert node.id == "a"
    node.detach()


def test_input_node_attach():
    node = InputNode("a")
    first_attach = rx.subject.BehaviorSubject(1)
    node.attach(first_attach)
    assert node.output_value() == 1

    node.attach(rx.just(2))
    assert node.output_value() == 2

    first_attach.on_next(3)
    assert node.output_value() == 2
    node.detach()
