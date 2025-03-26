import pytest
import json
from fastapi.testclient import TestClient
import pytest
import sys
import os
import io

# Ensure the parent directory (where main.py is located) is in the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app  # Now Python can find main.py
from fastapi.testclient import TestClient

client = TestClient(app)


# Mock customer data
mock_customer_data = [
    {"Name": "Emma", "Password": "Emma#123"},
    {"Name": "AnotherRetailUser", "Password": "Password456"}
]

# Mock corporate data
mock_corporate_data = {
    "Corp123": {"Company Name": "Renewable Energy and Sustainability Houston", "Password": "RenewableEnergyandSustainabilityHouston#123"},
    "Corp456": {"Company Name": "AnotherCorp", "Password": "SecurePass"}
}

def mock_open_file(filepath, mode="r"):
    """Return a file-like object for mocking open()"""
    filepath = str(filepath)  # ✅ Ensure filepath is a string

    if "customer_data.json" in filepath:
        data = mock_customer_data
    elif "corporate_data.json" in filepath:
        data = mock_corporate_data
    else:
        data = {}

    json_data = json.dumps(data)

    # Handle binary mode ("rb")
    if "b" in mode:
        return io.BytesIO(json_data.encode("utf-8"))  # ✅ Convert to bytes
    return io.StringIO(json_data)  # ✅ Return text mode file-like object

# ---------------------
# Test Cases
# ---------------------

@pytest.fixture
def mock_file_reading(monkeypatch):
    """Mock built-in open() for file reading"""
    monkeypatch.setattr("builtins.open", lambda path, mode="r": mock_open_file(str(path), mode))  # ✅ Convert path to string

def test_login_retail_success(mock_file_reading):
    """Test successful login for a retail user"""
    payload = {"name": "Emma", "password": "Emma#123"}
    response = client.post("/login", json=payload)

    assert response.status_code == 200
    assert response.json() is True  # ✅ Login should be successful

def test_login_corporate_success(mock_file_reading):
    """Test successful login for a corporate user"""
    payload = {"name": "Renewable Energy and Sustainability Houston", "password": "RenewableEnergyandSustainabilityHouston#123"}
    response = client.post("/login", json=payload)

    assert response.status_code == 200
    assert response.json() is True  # ✅ Login should be successful

def test_login_invalid_password(mock_file_reading):
    """Test login failure due to incorrect password"""
    payload = {"name": "RetailUser", "password": "WrongPassword"}
    response = client.post("/login", json=payload)

    assert response.status_code == 200
    assert response.json() is False  # ✅ Login should fail

def test_login_user_not_found(mock_file_reading):
    """Test login failure when user does not exist"""
    payload = {"name": "UnknownUser", "password": "SomePass"}
    response = client.post("/login", json=payload)

    assert response.status_code == 200
    assert response.json() is False  # ✅ Login should fail

if __name__ == "__main__":
    pytest.main()