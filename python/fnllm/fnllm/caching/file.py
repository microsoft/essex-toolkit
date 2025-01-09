# Copyright (c) 2024 Microsoft Corporation.

"""File cache implementation for the `Cache` protocol.."""

from __future__ import annotations

import json
import logging
import time
from pathlib import Path
from typing import Any

from fnllm.caching.base import Cache

_log = logging.getLogger(__name__)


class FileCache(Cache):
    """The FileCache class."""

    def __init__(self, cache_path: Path | str, encoding: str | None = None):
        """Initialize the cache."""
        if isinstance(cache_path, str):
            cache_path = Path(cache_path)

        self._cache_path = cache_path
        self._cache_path.mkdir(exist_ok=True, parents=True)
        self._encoding = encoding or "utf-8"

    @property
    def root_path(self) -> Path:
        """Cache path in the filesystem."""
        return self._cache_path

    async def has(self, key: str) -> bool:
        """Check if the cache has a value."""
        return (self._cache_path / key).exists()

    async def get(self, key: str) -> Any | None:
        """Retrieve a value from the cache."""
        path = self._cache_path / key

        if not path.exists():
            return None

        try:
            cache_entry = json.loads(path.read_text(encoding=self._encoding))
        except json.JSONDecodeError:
            _log.warning("Cache entry %s is corrupted", path)
            return None
        except PermissionError:
            _log.error("Permission denied for file %s", path)
            return None
        except UnicodeDecodeError:
            _log.error("Encoding error reading file %s", path)
            return None

        # Mark the cache entry as updated to keep it alive
        cache_entry["accessed"] = time.time()
        (self._cache_path / key).write_text(
            _content_text(cache_entry),
            encoding=self._encoding,
        )

        return cache_entry["result"]

    async def remove(self, key: str) -> None:
        """Remove a value from the cache."""
        (self._cache_path / key).unlink()

    async def clear(self) -> None:
        """Clear the cache."""
        _clear_dir(self._cache_path)

    async def set(
        self, key: str, value: Any, metadata: dict[str, Any] | None = None
    ) -> None:
        """Write a value into the cache."""
        create_time = time.time()
        content = {
            "result": value,
            "metadata": metadata,
            "created": create_time,
            "accessed": create_time,
        }
        (self._cache_path / key).write_text(
            _content_text(content),
            encoding=self._encoding,
        )

    def child(self, key: str) -> FileCache:
        """Create a child cache."""
        return FileCache(self._cache_path / key)


def _content_text(item: dict[str, Any]) -> str:
    """Return the content of the cache item."""
    return json.dumps(item, indent=2, ensure_ascii=False)


def _clear_dir(path: Path) -> None:
    """Clear a directory."""
    _log.debug("removing path %s", path)

    for f in path.iterdir():
        if f.is_dir():
            _clear_dir(f)
            f.rmdir()
        else:
            _log.debug("removing file %s", f)
            f.unlink()
