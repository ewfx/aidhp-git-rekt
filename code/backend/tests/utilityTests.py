import pytest
import sys
import os

# Ensure parent directory is in Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import extract_customer_id, extract_top_3

# ---------------------
# Test extract_customer_id function
# ---------------------
def test_extract_customer_id():
    assert extract_customer_id("CUST00123") == 123
    assert extract_customer_id("CUST045") == 45
    assert extract_customer_id("12345") is None
    assert extract_customer_id("CUSTA123") is None

# ---------------------
# Test extract_top_3 function
# ---------------------
def test_extract_top_3():
    transactions = [
        {"Category": "Groceries"},
        {"Category": "Electronics"},
        {"Category": "Groceries"},
        {"Category": "Dining"},
        {"Category": "Groceries"},
        {"Category": "Dining"},
    ]
    assert extract_top_3(transactions) == ["Groceries", "Dining", "Electronics"]

if __name__ == "__main__":
    pytest.main()
