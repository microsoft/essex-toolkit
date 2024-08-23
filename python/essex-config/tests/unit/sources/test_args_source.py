import pytest

from essex_config.sources import ArgSource


def test_arg_source():
    source = ArgSource(test_value="test", test_int=1)

    assert source.get_value("test_value", str) == "test"
    assert source.get_value("test_int", int) == 1
    assert str(source) == "Argsource({'test_value': 'test', 'test_int': 1})"


def test_not_found():
    source = ArgSource(test_value="test", test_int=1)

    assert "NOT_FOUND" not in source

    with pytest.raises(KeyError, match="Key NOT_FOUND not found in the source."):
        source.get_value("NOT_FOUND", str)
