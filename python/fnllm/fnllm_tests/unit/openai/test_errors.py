# Copyright (c) 2025 Microsoft Corporation.
"""Error module tests."""


def test_can_import_errors():
    import fnllm.openai.errors as e

    assert e is not None
