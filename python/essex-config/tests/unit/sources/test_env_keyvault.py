import os
from unittest.mock import Mock, patch

import pytest

from essex_config.sources import KeyvaultSource


@patch("essex_config.sources.keyvault_source.KeyvaultClient")  # Mock KeyvaultClient
def test_keyvault(mock_keyvault_client):
    # Create a mock instance of KeyvaultClient
    secrets = {"secret1": "value_of_secret1", "secret2": "42"}
    mock_client = Mock()
    mock_client.secrets = ["secret1", "secret2"]
    mock_client.get_secret.side_effect = lambda secret: secrets[secret]

    mock_keyvault_client.get_keyvault_client.return_value = mock_client

    # Initialize KeyvaultSource with a keyvault_name
    source = KeyvaultSource("my_keyvault")

    # Call get_data and verify the results
    assert source.get_value("secret1", str) == "value_of_secret1"
    assert source.get_value("secret2", int) == 42

    # Verify that the methods were called correctly
    mock_client.get_secret.assert_any_call("secret1")
    mock_client.get_secret.assert_any_call("secret2")


@patch("essex_config.sources.keyvault_source.KeyvaultClient")  # Mock KeyvaultCl
def test_keyvault_env_name(mock_keyvault_client):
    # Set the environment variable
    os.environ["KEYVAULT_NAME"] = "my_keyvault"

    # Create a mock instance of KeyvaultClient
    mock_client = Mock()
    mock_client.secrets = ["secret1", "secret2"]
    mock_client.get_secret.side_effect = lambda secret: f"value_of_{secret}"

    mock_keyvault_client.get_keyvault_client.return_value = mock_client
    # Initialize KeyvaultSource with a keyvault_env_name
    source = KeyvaultSource("KEYVAULT_NAME", use_env_var=True)

    # Call get_data and verify the results
    assert source.get_value("secret1", str) == "value_of_secret1"
    assert source.get_value("secret2", str) == "value_of_secret2"
    assert str(source) == "KeyvaultSource(keyvault_name=KEYVAULT_NAME,use_env_var=True)"

    # Verify that the methods were called correctly
    mock_client.get_secret.assert_any_call("secret1")
    mock_client.get_secret.assert_any_call("secret2")

    # Unset the environment variable
    del os.environ["KEYVAULT_NAME"]


@patch("essex_config.sources.keyvault_source.KeyvaultClient")  # Mock KeyvaultClient
def test_missing_key(mock_keyvault_client):
    # Create a mock instance of KeyvaultClient
    secrets = {"secret1": "value_of_secret1", "secret2": "42"}
    mock_client = Mock()
    mock_client.secrets = ["secret1", "secret2"]
    mock_client.get_secret.side_effect = lambda secret: secrets[secret]

    mock_keyvault_client.get_keyvault_client.return_value = mock_client

    # Initialize KeyvaultSource with a keyvault_name
    source = KeyvaultSource("my_keyvault")

    # Call get_data and verify the results
    assert "MISSING_KEY" not in source
    with pytest.raises(KeyError, match="Key MISSING_KEY not found in the keyvault."):
        source.get_value("MISSING_KEY", str)
