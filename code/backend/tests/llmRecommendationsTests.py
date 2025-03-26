import json
import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app


test_client = TestClient(app)

# Mock Data for testing
def mock_json_data(file_name):
    mock_data = {
        "rules.json": [{"product": "Gold Credit Card", "eligibility": "Credit Score > 700"}],
        "customer_data.json": [{
            "Age": 30,
            "Credit Score": 750,
            "Income per Year": 60000,
            "Transactions": ["electronics", "travel", "groceries"],
            "Monthly Expenses": 2000,
            "Education": "Bachelor’s"
        }],
        "corporate_data.json": {
            "CORP001": {
                "Revenue (in dollars)": 5000000,
                "No of Employees": 200,
                "Transactions": ["business loans", "commercial insurance"]
            }
        }
    }
    return mock_data.get(file_name, {})

@pytest.fixture
def mock_files(mocker):
    mocker.patch("builtins.open", side_effect=lambda f, _: mock_json_data(f))
    mocker.patch("json.load", side_effect=lambda f: f)

def test_llm_recommendations_retail(mock_files, mocker):
    mocker.patch("main.client.chat.completions.create", return_value={
        "choices": [{"message": {"content": '[{"name": "Gold Credit Card", "why": "High credit score."}]'}}]
    })
    response = test_client.post("/llmRecommendations", json={"customer_id": "CUST000001"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "name" in data[0]
    assert "why" in data[0]

def test_llm_recommendations_commercial(mock_files, mocker):
    mocker.patch("main.client.chat.completions.create", return_value={
        "choices": [{"message": {"content": '[{"name": "Business Loan", "why": "High revenue company."}]'}}]
    })
    response = test_client.post("/llmRecommendations", json={"customer_id": "CORP001"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "name" in data[0]
    assert "why" in data[0]

def test_llm_invalid_json_response(mock_files, mocker):
    mocker.patch("main.client.chat.completions.create", return_value={
        "choices": [{"message": {"content": "Invalid Response"}}]
    })
    response = test_client.post("/llmRecommendations", json={"customer_id": "CUST000002"})
    assert response.status_code == 200  # Service should not crash
    assert response.json() == []  # Should return an empty list for invalid JSON
