import pytest
import json
import io
from fastapi.testclient import TestClient
import sys
import os

# Ensure the parent directory (where main.py is located) is in the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app, extract_customer_id # Now Python can find main.py
from fastapi.testclient import TestClient

client = TestClient(app)

# Mock customer data
mock_customer_data = [
    {
        "customer_id": "CG_US_000001",
        "Name": "John Doe",
        "Transactions": []
    }
]

# Mock corporate data
mock_corporate_data = {
    "CG_US_000001": {
        "Company Name": "ABC Corp",
        "Transactions": []
    }
}

# Mock transactions on hold
mock_transactions_on_hold = []

# Mock function for detecting fraud
def mock_detect_fraud_transactions(transactions):
    """Returns a mock fraud check result"""
    last_transaction = transactions[-1]
    if last_transaction["Amount"] > 5000:  # Simulate fraud for high-value transactions
        return {"is_fraudulent": True, "risk_score": 90}
    return {"is_fraudulent": False, "risk_score": 10}

# Mock function to simulate file reading
def mock_open_file(filepath, mode="r"):
    """Return a file-like object for mocking open()"""
    filepath = str(filepath)  # Ensure filepath is a string

    if "customer_data.json" in filepath:
        data = mock_customer_data
    elif "corporate_data.json" in filepath:
        data = mock_corporate_data
    elif "transactions_on_hold.json" in filepath:
        data = mock_transactions_on_hold
    else:
        data = {}

    json_data = json.dumps(data)

    if "b" in mode:
        return io.BytesIO(json_data.encode("utf-8"))  # Convert to bytes
    return io.StringIO(json_data)  # Return text mode file-like object

# ---------------------
# Test Cases
# ---------------------

@pytest.fixture
def mock_file_reading(monkeypatch):
    """Mock built-in open() for file reading"""
    monkeypatch.setattr("builtins.open", lambda path, mode="r": mock_open_file(str(path), mode))
    monkeypatch.setattr("main.detect_fraud_transactions", mock_detect_fraud_transactions)  # Mock fraud detection

def test_add_transaction_retail_success(mock_file_reading):
    """Test successful transaction for a retail customer"""
    payload = {
        "customer_id": "CUST000001",
        "Transaction_Type": "Purchase",
        "Category": "Groceries",
        "Amount": 100.00,
        "Purchase_Date": "2024-03-25",
        "Payment_Mode": "Credit Card",
        "Merchant_Vendor": "Walmart"
    }
    response = client.post("/addTransaction", json=payload)

    assert response.status_code == 200, response.text
    assert response.json()["is_fraudulent"] is False  # ✅ Transaction should be approved

def test_add_transaction_corporate_success(mock_file_reading):
    """Test successful transaction for a corporate customer"""
    payload = {
        "customer_id": "CG_US_000001",
        "Transaction_Type": "Invoice Payment",
        "Category": "Office Supplies",
        "Amount": 2000.00,
        "Purchase_Date": "2024-03-25",
        "Payment_Mode": "Bank Transfer",
        "Merchant_Vendor": "OfficeDepot"
    }
    response = client.post("/addTransaction", json=payload)

    assert response.status_code == 200, response.text
    assert response.json()["is_fraudulent"] is False  # ✅ Should be processed normally

def test_fraudulent_transaction(mock_file_reading):
    """Test a transaction that gets flagged as fraudulent"""
    payload = {
        "customer_id": "CUST000001",
        "Transaction_Type": "Purchase",
        "Category": "Electronics",
        "Amount": 6000.00,  # ❌ Fraud threshold (over $5000)
        "Purchase_Date": "2024-03-25",
        "Payment_Mode": "Credit Card",
        "Merchant_Vendor": "Best Buy"
    }
    response = client.post("/addTransaction", json=payload)

    assert response.status_code == 200, response.text
    assert response.json()["is_fraudulent"] is True  # ✅ Should be flagged as fraud

def test_missing_customer_id(mock_file_reading):
    """Test missing customer_id in the request"""
    payload = {
        "Transaction_Type": "Purchase",
        "Category": "Groceries",
        "Amount": 100.00,
        "Purchase_Date": "2024-03-25",
        "Payment_Mode": "Credit Card",
        "Merchant_Vendor": "Walmart"
    }
    response = client.post("/addTransaction", json=payload)

    assert response.status_code == 422  # ✅ FastAPI should return an error for missing required fields

if __name__ == "__main__":
    pytest.main()
