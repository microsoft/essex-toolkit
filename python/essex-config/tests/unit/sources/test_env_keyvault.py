import os
from unittest.mock import MagicMock, patch

from essex_config.sources import KeyvaultSource


@patch("essex_config.sources.keyvault_source.KeyvaultClient")  # Mock KeyvaultClient
def test_get_data(mock_keyvault_client):
    # Create a mock instance of KeyvaultClient
    mock_client = mock_keyvault_client.return_value
    mock_client.list_secrets.return_value = ["secret1", "secret2"]
    mock_client.get_secret.side_effect = lambda secret: f"value_of_{secret}"

    # Initialize KeyvaultSource with a keyvault_name
    source = KeyvaultSource("my_keyvault")

    # Call get_data and verify the results
    data = source.get_data()
    expected_data = {"secret1": "value_of_secret1", "secret2": "value_of_secret2"}
    assert data == expected_data
    assert str(source) == "KeyvaultSource(keyvault_name=my_keyvault,use_env_var=False)"

    # Verify that the methods were called correctly
    mock_client.list_secrets.assert_called_once()
    mock_client.get_secret.assert_any_call("secret1")
    mock_client.get_secret.assert_any_call("secret2")


def test_keyvault_env_name():
    # Set the environment variable
    os.environ["KEYVAULT_NAME"] = "my_keyvault"

    # Create a mock instance of KeyvaultClient
    mock_client = MagicMock()
    mock_client.list_secrets.return_value = ["secret1", "secret2"]
    mock_client.get_secret.side_effect = lambda secret: f"value_of_{secret}"
    with patch(
        "essex_config.sources.keyvault_source.KeyvaultClient", return_value=mock_client
    ):
        # Initialize KeyvaultSource with a keyvault_env_name
        source = KeyvaultSource("KEYVAULT_NAME", use_env_var=True)

        # Call get_data and verify the results
        data = source.get_data()
        expected_data = {"secret1": "value_of_secret1", "secret2": "value_of_secret2"}
        assert data == expected_data
        assert (
            str(source)
            == "KeyvaultSource(keyvault_name=KEYVAULT_NAME,use_env_var=True)"
        )

        # Verify that the methods were called correctly
        mock_client.list_secrets.assert_called_once()
        mock_client.get_secret.assert_any_call("secret1")
        mock_client.get_secret.assert_any_call("secret2")

    # Unset the environment variable
    del os.environ["KEYVAULT_NAME"]
