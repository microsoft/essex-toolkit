# Copyright (c) 2024 Microsoft Corporation.
"""Call tests."""

import pytest
from fnllm.utils.batch import (
    BatchResponseInvalidError,
    Call,
    CallBatch,
)


async def test_call_batch_sequence() -> None:
    batch = CallBatch()
    call_1 = Call(input="prompt1", cost=10)
    call_2 = Call(input="prompt2", cost=20)
    call_3 = Call(input="prompt3", cost=30)
    batch.calls.append(call_1)
    batch.calls.append(call_2)
    batch.calls.append(call_3)

    assert batch.num_calls == 3
    assert batch.cost == 60

    batch.on_response([[1.0], [2.0], [3.0]])
    assert await call_1.response == [1.0]
    assert await call_2.response == [2.0]
    assert await call_3.response == [3.0]


def test_call_batch_raises_if_response_length_mismatch() -> None:
    batch = CallBatch()
    call_1 = Call(input="prompt1", cost=10)
    call_2 = Call(input="prompt2", cost=20)
    batch.calls.append(call_1)
    batch.calls.append(call_2)

    with pytest.raises(BatchResponseInvalidError):
        batch.on_response([[1.0]])
