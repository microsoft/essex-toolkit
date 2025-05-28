# Copyright (c) 2025 Microsoft Corporation.

import asyncio

from aiolimiter import AsyncLimiter
from fnllm.limiting import LimitReconciliation
from fnllm.limiting.update_limiter import update_limiter


async def test_update_limiter():
    await asyncio.sleep(0)
    limiter = AsyncLimiter(1)
    reconciliation = LimitReconciliation(limit=1234.0, remaining=5678.0)
    update_limiter(limiter, reconciliation)
    assert limiter.max_rate == 1234.0
