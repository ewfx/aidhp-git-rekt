from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import joblib
from sklearn.neighbors import NearestNeighbors
import numpy as np
import json
from openai import OpenAI
import re
from collections import defaultdict, Counter
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="HyperFin AI - Churn Risk Prediction/Recommendation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] safer
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("models/churn_xgboost_optimized.pkl")

# Match EXACT feature names used in training
class CustomerData(BaseModel):
    Age: int
    Income_dollar: float        # Matches 'Income($)'
    Credit_Score: int
    Avg_Monthly_Spend: float
    Max_Spend: float
    Total_Delinquency: int
    Missed_Payments: int
    Sentiment_Score: float
    Survey_Score: float
    Total_Spend: float
    Frequency: int
    Recency: int
    Gender: int
    Location: int

def format_products_for_llm(rules):
    product_list = []

    # Function to format eligibility criteria
    def format_eligibility(details):
        if "eligibility" in details:
            eligibility = details["eligibility"]
            criteria = [f"{key.replace('_', ' ').capitalize()}: {value}" for key, value in eligibility.items()]
            return " | ".join(criteria)
        return "No eligibility criteria"

    # Credit Cards
    for card_name, card_details in rules.get("credit_cards", {}).items():
        if "name" in card_details:
            product_list.append(f"Credit Card: {card_details['name']}")
            product_list.append(f"type: {card_details['type']}")
            print(f"Credit Card: {card_details['name']}")
            print(f"type: {card_details['type']}")
        for tier, details in card_details.items():
            if isinstance(details, dict) and "name" in details:
                benefits = ", ".join(details.get("benefits", ["No listed benefits"]))
                eligibility = format_eligibility(details)
                product_list.append(f"  - {details['name']} - Benefits: {benefits} | Eligibility: {eligibility}")

    # Debit Cards
    for card_name, card_details in rules.get("debit_cards", {}).items():
        if "name" in card_details:
            product_list.append(f"Debit Card: {card_details['name']}")
            product_list.append(f"type: {card_details['type']}")
            print(f"Debit Card: {card_details['name']}")
            print(f"type: {card_details['type']}")

        for tier, details in card_details.items():
            if isinstance(details, dict) and "name" in details:
                benefits = ", ".join(details.get("benefits", ["No listed benefits"]))
                eligibility = format_eligibility(details)
                product_list.append(f"  - {details['name']} - Benefits: {benefits} | Eligibility: {eligibility}")

    # Services
    for service_name, service_details in rules.get("services", {}).items():
        if "name" in service_details:
            product_list.append(f"Service: {service_details['name']}")
            product_list.append(f"type: {service_details['type']}")
            print(f"Service: {service_details['name']}")
            print(f"type: {service_details['type']}")

        for option, details in service_details.items():
            if isinstance(details, dict) and "name" in details:
                benefits = ", ".join(details.get("benefits", ["No listed benefits"]))
                eligibility = format_eligibility(details)
                product_list.append(f"  - {details['name']} - Benefits: {benefits} | Eligibility: {eligibility}")

    return product_list

def extract_customer_id(text):
    match = re.search(r"CUST0*(\d+)", text)  # Match 'CUST' followed by digits
    return int(match.group(1)) if match else None  # Convert to int to remove leading zeros

def extract_top_3(transactions):
    categories=[]
    for transaction in transactions:
        categories.append(transaction["Category"])
        interests_list = Counter(categories)
        top_3_items = [item for item, count in interests_list.most_common(3)]
        print("top3 categories are",top_3_items)
        return top_3_items



@app.get("/")
def home():
    return {"message": "HyperFin AI Churn Prediction API Working"}

@app.post("/predict-churn")
def predict_churn(data: CustomerData):
    # Prepare DataFrame matching trained model column names
    input_df = pd.DataFrame([{
        "Age": data.Age,
        "Income($)": data.Income_dollar,
        "Credit_Score": data.Credit_Score,
        "Avg_Monthly_Spend": data.Avg_Monthly_Spend,
        "Max_Spend": data.Max_Spend,
        "Total_Delinquency": data.Total_Delinquency,
        "Missed_Payments": data.Missed_Payments,
        "Sentiment_Score": data.Sentiment_Score,
        "Survey_Score": data.Survey_Score,
        "Total_Spend": data.Total_Spend,
        "Frequency": data.Frequency,
        "Recency": data.Recency,
        "Gender": data.Gender,
        "Location": data.Location
    }])

    # Predict
    prediction = model.predict(input_df)[0]
    risk = "High Risk" if prediction == 1 else "Low/Medium Risk"
    return {"Customer Risk Segment": risk}


knn_model = joblib.load('models/knn_recommendation_model.pkl')
interaction_matrix = pd.read_csv('models/interaction_matrix.csv', index_col=0)

# Load Product Catalog
products = pd.read_csv('models/product_catalog.csv')

# Product mapping (Category → Product Names)
product_category_map = products.groupby('Product_Type')['Product_Name'].apply(list).to_dict()

# -------------------------
# Recommendation Endpoint
# -------------------------

class RecommendationInput(BaseModel):
    customer_id: str
    top_n: int = 5

class LlmRecommendationInput(BaseModel):
    customer_id: str

@app.post("/recommendations")
def recommend(input: RecommendationInput):
    cust_id = input.customer_id
    if cust_id not in interaction_matrix.index:
        return {"error": "Customer ID not found"}

    # Customer interaction vector
    customer_vector = interaction_matrix.loc[cust_id].values.reshape(1, -1)
    distances, indices = knn_model.kneighbors(customer_vector, n_neighbors=input.top_n + 1)

    # Skip first neighbor (itself)
    similar_indices = indices.flatten()[1:]

    similar_customers = interaction_matrix.index[similar_indices].tolist()

    # Recommend categories bought by similar customers
    recommended_categories = []
    for sim_cust in similar_customers:
        products_bought = interaction_matrix.loc[sim_cust]
        bought_categories = products_bought[products_bought > 0].index.tolist()
        recommended_categories.extend(bought_categories)

    # Remove duplicates
    recommended_categories = list(set(recommended_categories))

    # Map categories to actual product names
    recommended_products = []
    for category in recommended_categories:
        product_names = product_category_map.get(category, [])
        recommended_products.extend(product_names)

    # Remove duplicates, limit to top N
    recommended_products = list(set(recommended_products))[:input.top_n]

    return {
        "Customer": cust_id,
        "Recommended Products": recommended_products
    }
