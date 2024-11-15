from pathlib import Path
from unittest.mock import mock_open, patch

from essex_config.doc_gen.printer.markdown_printer import MarkdownConfigurationPrinter
from pydantic import BaseModel


def test_basic_config():
    class BasicConfiguration(BaseModel):
        hello: str
        world: str | int

    printer = MarkdownConfigurationPrinter(Path("test.md"))

    with patch("pathlib.Path.open", mock_open()) as mocked_file:
        printer.print(BasicConfiguration, disable_nested=False)
        mocked_file.assert_called_once_with("a")
        mocked_file().write.assert_called_once_with(
            "# BasicConfiguration\n\n"
            "## Parameters:\n\n"
            "|Name|Description|Alias|Prefix|Required?|Default|\n"
            "|---|---|---|---|---|---|\n"
            "|hello: str||||True||\n"
            "|world: str,int||||True||\n\n"
        )


def test_nested():
    class NestedConfiguration(BaseModel):
        world: str

    class BasicConfiguration(BaseModel):
        hello: str
        nested: NestedConfiguration

    printer = MarkdownConfigurationPrinter(Path("test.md"))

    with patch("pathlib.Path.open", mock_open()) as mocked_file:
        printer.print(BasicConfiguration, disable_nested=False)
        mocked_file.assert_called_once_with("a")
        assert mocked_file().write.call_count == 2

        assert mocked_file().write.call_args_list[0][0][0] == (
            "# BasicConfiguration\n\n"
            "## Parameters:\n\n"
            "|Name|Description|Alias|Prefix|Required?|Default|\n"
            "|---|---|---|---|---|---|\n"
            "|hello: str||||True||\n"
            "|nested: NestedConfiguration|See nested: NestedConfiguration for more details.|||True||\n\n"
        )

        assert mocked_file().write.call_args_list[1][0][0] == (
            "# nested: NestedConfiguration\n\n"
            "## Parameters:\n\n"
            "|Name|Description|Alias|Prefix|Required?|Default|\n"
            "|---|---|---|---|---|---|\n"
            "|world: str|||nested|True||\n\n"
        )
