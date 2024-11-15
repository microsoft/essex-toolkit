from unittest.mock import MagicMock, Mock, patch

from essex_config.doc_gen.printer.rich_printer import RichConfigurationPrinter
from pydantic import BaseModel


@patch("essex_config.doc_gen.printer.rich_printer.print")
@patch("essex_config.doc_gen.printer.rich_printer.Panel")
@patch("essex_config.doc_gen.printer.rich_printer.Table")
@patch("essex_config.doc_gen.printer.rich_printer.Markdown")
@patch("essex_config.doc_gen.printer.rich_printer.Group")
def test_basic_config(
    mock_group: Mock,
    mock_markdown: Mock,
    mock_table: Mock,
    mock_panel: Mock,
    mock_print: Mock,
):
    class BasicConfiguration(BaseModel):
        hello: str
        world: str | int

    mock_group.return_value = MagicMock()
    mock_markdown.return_value = MagicMock()
    params_table_mock = MagicMock()
    mock_table.return_value = params_table_mock
    mock_panel.return_value = MagicMock()
    mock_print.return_value = MagicMock()

    printer = RichConfigurationPrinter()

    printer.print(BasicConfiguration, disable_nested=False)

    mock_print.assert_called_once()
    mock_panel.assert_called_once()

    mock_table.assert_called_once()
    assert params_table_mock.add_column.call_count == 6
    assert params_table_mock.add_row.call_count == 2
    mock_markdown.assert_called_once()
    mock_group.assert_called_once()


@patch("essex_config.doc_gen.printer.rich_printer.print")
@patch("essex_config.doc_gen.printer.rich_printer.Panel")
@patch("essex_config.doc_gen.printer.rich_printer.Table")
@patch("essex_config.doc_gen.printer.rich_printer.Markdown")
@patch("essex_config.doc_gen.printer.rich_printer.Group")
def test_nested(
    mock_group: Mock,
    mock_markdown: Mock,
    mock_table: Mock,
    mock_panel: Mock,
    mock_print: Mock,
):
    class NestedConfiguration(BaseModel):
        world: str

    class BasicConfiguration(BaseModel):
        hello: str
        nested: NestedConfiguration

    mock_group.return_value = MagicMock()
    mock_markdown.return_value = MagicMock()
    params_table_mock = MagicMock()
    mock_table.return_value = params_table_mock
    mock_panel.return_value = MagicMock()
    mock_print.return_value = MagicMock()

    printer = RichConfigurationPrinter()

    printer.print(BasicConfiguration, disable_nested=False)

    assert mock_print.call_count == 2
    assert mock_panel.call_count == 2

    assert mock_table.call_count == 2
    assert params_table_mock.add_column.call_count == 12
    assert params_table_mock.add_row.call_count == 3

    assert mock_markdown.call_count == 2
    assert mock_group.call_count == 2
