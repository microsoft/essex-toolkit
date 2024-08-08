from unittest.mock import MagicMock

from essex_config.doc_gen.doc_gen import generate_docs

from . import sample_module


def test_generate_docs():
    mock_printer = MagicMock()
    generate_docs(sample_module.__name__, mock_printer, [], False)
    mock_printer.print.assert_called_once()


def test_generate_docs_filter():
    mock_printer = MagicMock()
    generate_docs(sample_module.__name__, mock_printer, ["MainConfiguration"], False)
    mock_printer.print.assert_called_once()


def test_generate_docs_filter_no_output():
    mock_printer = MagicMock()
    generate_docs(sample_module.__name__, mock_printer, ["SomeConfiguration"], False)
    assert mock_printer.print.call_count == 0
