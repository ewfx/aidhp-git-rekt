import pytest
import json
import io
from fastapi.testclient import TestClient
import sys
import os

# Ensure the parent directory (where main.py is located) is in the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import main  # Import the entire main module

client = TestClient(main.app)

# ---------------------
# Mock Data
# ---------------------

# Mock retention offers
mock_retention_offers = [
    {"type": "retention_offer", "name": "10% Cashback", "reason": "Customer had a negative experience."}
]

# Mock loyalty rewards
mock_loyalty_rewards = [
    {"type": "loyalty_reward", "name": "VIP Lounge Access", "reason": "Customer is highly satisfied."}
]

# Mock bank comments
mock_nova_bank_comments = {
    "CUST000001": [
        {"comment": "This bank has the worst customer service ever!"},
        {"comment": "I am unhappy with the fees."}
    ],
    "CUST000002": [
        {"comment": "I love the rewards program!"},
        {"comment": "The app is super easy to use."}
    ],
    "CUST000003": [
        {"comment": "Service is okay, nothing special."}
    ]
}

# Mock function for sentiment analysis
def mock_get_sentiment_score(comment):
    """Returns a fake sentiment score based on keywords"""
    if "worst" in comment or "unhappy" in comment:
        return -0.8  # Negative sentiment
    elif "love" in comment or "easy" in comment:
        return 0.7  # Positive sentiment
    return 0.0  # Neutral sentiment

# Mock function to simulate file reading
def mock_open_file(filepath, mode="r"):
    """Return a file-like object for mocking open()"""
    filepath = str(filepath)  # Ensure filepath is a string

    if "retention_offers.json" in filepath:
        data = mock_retention_offers
    elif "loyalty_rewards.json" in filepath:
        data = mock_loyalty_rewards
    elif "nova_bank_comments.json" in filepath:
        data = mock_nova_bank_comments
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

@pytest.fixture
def mock_sentiment_analysis(monkeypatch):
    """Mock sentiment analysis function inside llmOffers at runtime"""
    def patched_llmOffers(input):
        """Wrapper for llmOffers that mocks `get_sentiment_score` inside"""
        original_llmOffers = main.llmOffers

        # Create a new function scope with modified globals
        def wrapped_llmOffers(input):
            original_globals = original_llmOffers.__globals__.copy()
            original_globals["get_sentiment_score"] = mock_get_sentiment_score
            return eval(original_llmOffers.__code__, original_globals, {"input": input})

        return wrapped_llmOffers(input)

    monkeypatch.setattr(main, "llmOffers", patched_llmOffers)

def test_llm_offers_negative_sentiment(mock_file_reading, mock_sentiment_analysis):
    """Test negative sentiment triggers a retention offer"""
    payload = {"customer_id": "CUST000001"}  # ❌ Negative comments
    response = client.post("/llmOffers", json=payload)

    assert response.status_code == 200, response.text
    assert isinstance(response.json(), list), f"Expected list but got {type(response.json())}"
    assert response.json()[0]["offer"][0]["type"] == "retention_offer"  # ✅ Should return retention offer

def test_llm_offers_positive_sentiment(mock_file_reading, mock_sentiment_analysis):
    """Test positive sentiment triggers a loyalty reward"""
    payload = {"customer_id": "CUST000002"}  # ✅ Positive comments
    response = client.post("/llmOffers", json=payload)

    assert response.status_code == 200, response.text
    assert isinstance(response.json(), list), f"Expected list but got {type(response.json())}"
    assert response.json()[0]["offer"][0]["type"] == "loyalty_reward"  # ✅ Should return loyalty reward

def test_llm_offers_neutral_sentiment(mock_file_reading, mock_sentiment_analysis):
    """Test neutral sentiment returns 'No Action Needed'"""
    payload = {"customer_id": "CUST000003"}  # 😐 Neutral comments
    response = client.post("/llmOffers", json=payload)

    assert response.status_code == 200, response.text
    assert isinstance(response.json(), list), f"Expected list but got {type(response.json())}"
    assert response.json()[0]["offer"] == "No offers / rewards!"  # ✅ No offers for neutral sentiment

def test_llm_offers_invalid_customer(mock_file_reading, mock_sentiment_analysis):
    """Test when customer ID does not exist"""
    payload = {"customer_id": "CUST999"}  # 🚫 Non-existent customer
    response = client.post("/llmOffers", json=payload)

    assert response.status_code == 404, response.text  # ✅ Should return 404 instead of 500
    assert "Customer not found" in response.json()["detail"], response.text

if __name__ == "__main__":
    pytest.main()
