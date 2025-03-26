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
import random
import random
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import time
import os





app = FastAPI(title="HyperFin AI - Churn Risk Prediction/Recommendation API")

app.add_middleware(
     CORSMiddleware,
     allow_origins=["*"],  # or ["http://localhost:3000"] safer
     allow_credentials=True,
     allow_methods=["*"],
     allow_headers=["*"],
 )


# -------------------------
# LLM client function
# -------------------------

client = OpenAI(
base_url="https://openrouter.ai/api/v1",
api_key="YOUR_API_KEY"
)


# -------------------------
# util functions for Recommendation Endpoint
# -------------------------


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


# -------------------------
# Recommendation Endpoint
# -------------------------

class RecommendationInput(BaseModel):
    customer_id: str
    top_n: int = 5

class LlmRecommendationInput(BaseModel):
    customer_id: str


@app.post("/llmRecommendations")
def llmRecommendations(input: LlmRecommendationInput):
    if input.customer_id.upper().startswith("CUST"):
        category="Retail"
    else:
        category="Commercial"

    with open("rules.json", "r") as file:
        rules = json.load(file)
    
    with open("customer_data.json", "r") as file:
        customer_data = json.load(file)
    
    with open("corporate_data.json", "r") as file:
        corporate_data = json.load(file)

    # Format all products for LLM
    banking_products = format_products_for_llm(rules)

    # Print a preview of the structured list for debugging
    print("\n".join(banking_products[:10]))  # Print only the first 10 for checking


    # Define customer profiles (Choose ONE at a time)
    if(category=="Retail"):
        customer_index = extract_customer_id(input.customer_id)
        customer_info = customer_data[customer_index-1]
        transactions = customer_info["Transactions"]
        interests_list = extract_top_3(transactions)
        customer_profiles = {
            "Retail": {
                "age": customer_info["Age"],
                "credit_score": customer_info["Credit Score"],
                "income": customer_info["Income per Year"],
                "interests": interests_list,
                "monthly_spending": customer_info["Monthly Expenses"],
                "education": customer_info["Education"],
            }
        }
    else:
        corporate_info = corporate_data[input.customer_id]
        transactions = corporate_info["Transactions"]
        interests_list = extract_top_3(transactions)
        customer_profiles = {
            "Commercial": {
                "annual_revenue": corporate_info["Revenue (in dollars)"],
                "employee_count": corporate_info["No of Employees"],
                "interests": interests_list
            }
    }

    # Select customer type: Change this to "Commercial" for business customers
    selected_profile_type = category  # Change to "Commercial" if needed
    customer_profile = customer_profiles[selected_profile_type]

    # Prepare structured prompt
    prompt = f"""
    You are a banking recommendation assistant.
    Your task is to recommend the most suitable NovaBank products (credit cards, debit cards, and services) based on the customer’s profile.

    **Customer Profile ({selected_profile_type}):**
    {json.dumps(customer_profile, indent=2)}

    **Available Offerings:**
    {json.dumps(banking_products, indent=2)}

    **Instructions:**
    1. Select the best products for the customer based on their profile.
    2. strictly Only choose relevant options from the available offerings provided and do not provide any other recommendations apart from the ones provided.
    3. Return the response **strictly in JSON format** with this structure:

    [
        {{"name": "Product/Service Name", "why": "Reason why this is a good fit"}},
        {{"name": "Product/Service Name", "why": "Reason why this is a good fit"}}
    ]

    Only return valid JSON, without any extra text or explanations.
    """

    # Call LLM
    completion = client.chat.completions.create(
        model="google/gemma-3-27b-it:free",
        messages=[
            {"role": "system", "content": "You are a banking recommendation assistant. Always return responses strictly in JSON format."},
            {"role": "user", "content": prompt}
        ]
    )

    # Extract response text
    response_text = completion.choices[0].message.content.strip()

    # ✅ Use regex to extract JSON safely
    match = re.search(r"\[\s*{.*}\s*\]", response_text, re.DOTALL)
    if match:
        response_text = match.group(0)

    # Try to parse JSON safely
    try:
        parsed_response = json.loads(response_text)

        # Save JSON to a file
        filename = f"banking_recommendations_{selected_profile_type.lower()}.json"
        with open(filename, "w") as file:
            json.dump(parsed_response, file, indent=2)

        print(f"✅ Recommendations saved to '{filename}'")
        print(type(parsed_response))
        return parsed_response[:3]

    except json.JSONDecodeError:
        print(f"❌ Error: LLM response was not valid JSON. Here is what was returned:")
        print(response_text)



# -------------------------
# Offers Endpoint
# -------------------------

@app.post("/llmOffers")
def llmOffers(input: LlmRecommendationInput):

    if input.customer_id.upper().startswith("CUST"):
        category="Retail"
    else:
        category="Commercial"

    with open("retention_offers.json", "r") as file:
        retention_offers = json.load(file)
    
    with open("loyalty_rewards.json", "r") as file:
        loyalty_rewards = json.load(file)
    
    with open("nova_bank_comments.json", "r") as file:
        nova_bank_comments = json.load(file)
    

    # Sample customer comments (Modify as needed)
    customer_comments = nova_bank_comments[input.customer_id]

    # Function to analyze sentiment using LLM
    def get_sentiment_score(comment):
        prompt = f"""
        Analyze the sentiment of this customer comment and return a **sentiment score** between -1 (very negative) to +1 (very positive).

        **Comment:** "{comment}"

        **Response format (JSON only):**
        {{"sentiment_score": <SCORE>}}
        """

        try:
            completion = client.chat.completions.create(
                model="google/gemma-3-27b-it:free",
                messages=[{"role": "system", "content": "You are an expert in sentiment analysis. Provide responses strictly in JSON format."},
                        {"role": "user", "content": prompt}]
            )
            print(completion)

            # Extract valid JSON
            response_text = completion.choices[0].message.content.strip()
            match = re.search(r"\{.*\}", response_text, re.DOTALL)
            if match:
                response_text = match.group(0)

            sentiment_data = json.loads(response_text)
            return sentiment_data.get("sentiment_score", 0)  # Default to neutral if missing

        except Exception as e:
            print(f"❌ Error processing sentiment: {e}")
            return 0  # Default to neutral if any error occurs
    
     # Function to analyze sentiment using LLM
    def get_offer(comments,overall_sentiment_score):

        # Prepare structured prompt
        negative_prompt = f"""
        You are a banking recommendation assistant.
        Your task is to recommend the most suitable retention offers based on the customer’s comments.

        **Customer Comments:**
        {json.dumps(comments, indent=2)}

        **Available Retention Offers:**
        {json.dumps(retention_offers, indent=2)}

        **Instructions:**
        1. Select the most relevant retention offer from the available list based on the customer’s comment.
        2. Strictly choose only from the provided lists of retention offers.
        3. Format the response **strictly in JSON** with this structure:

        [
            {{"type": "retention_offer"}},
            {{"name": "Selected Offer Name"}},
            {{"reason": "Explanation of why this is the best fit based on the comment"}}
        ]

        """

        # Prepare structured prompt
        positive_prompt = f"""
        You are a banking recommendation assistant.
        Your task is to recommend the most suitable loyalty rewards based on the customer’s comments.

        **Customer Comments:**
        {json.dumps(comments, indent=2)}

        **Available Loyalty Rewards:**
        {json.dumps(loyalty_rewards, indent=2)}

        **Instructions:**
        1. Select the most relevant loyalty reward from the available list based on the customer’s comments.
        2. Strictly choose only from the provided lists of loyalty rewards.
        3. Format the response **strictly in JSON** with this structure:

        [
            {{"type": "loyalty_reward"}},
            {{"name": "Selected Reward"}},
            {{"reason": "Explanation of why this is the best fit based on the comment"}}
        ]

        """

        if overall_sentiment_score <= -0.3:
            prompt = negative_prompt
        elif overall_sentiment_score >=0.3:
            prompt = positive_prompt
        else:
            return "No Action Needed"
        
        # Call LLM
        completion = client.chat.completions.create(
            model="google/gemma-3-27b-it:free",
            messages=[
                {"role": "system", "content": "You are a banking recommendation assistant. Always return responses strictly in JSON format."},
                {"role": "user", "content": prompt}
            ]
        )

        # Extract response text
        response_text = completion.choices[0].message.content.strip()

        # ✅ Use regex to extract JSON safely
        match = re.search(r"\[\s*{.*}\s*\]", response_text, re.DOTALL)
        if match:
            response_text = match.group(0)

        # Try to parse JSON safely
        try:
            parsed_response = json.loads(response_text)

            # Save JSON to a file
            filename = f"banking_offers.json"
            with open(filename, "w") as file:
                json.dump(parsed_response, file, indent=2)

            print(f"✅ Offers saved to '{filename}'")
            return parsed_response[:3]

        except json.JSONDecodeError:
            print(f"❌ Error: LLM response was not valid JSON. Here is what was returned:")
            print(response_text)


    # Process all customer comments and group sentiment scores
    customer_sentiments = defaultdict(list)
    comments=[]
    for customer in customer_comments:
        sentiment_score = get_sentiment_score(customer["comment"])
        customer_sentiments[input.customer_id].append(sentiment_score)
        comments.append(customer["comment"])

    # Function to calculate overall sentiment for each customer
    def calculate_overall_sentiment(sentiment_scores):
        return sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0


    # Process final offers
    customer_offers = []
    for customer_id, sentiments in customer_sentiments.items():
        overall_sentiment = calculate_overall_sentiment(sentiments)
    
    offer = get_offer(comments,overall_sentiment)

    # ✅ Only add to final JSON if an offer is provided
    if offer != "No Action Needed":
        customer_offers.append({
            "customer_id": customer_id,
            "overall_sentiment_score": round(overall_sentiment, 2),
            "offer": offer
        })
    else:
        print("No offers/rewards!")
        customer_offers.append({
            "customer_id": customer_id,
            "overall_sentiment_score": round(overall_sentiment, 2),
            "offer": "No offers / rewards!"
        })

    # Save final offers JSON
    with open("customer_offers.json", "w") as file:
        json.dump({"customer_offers": customer_offers}, file, indent=2)
        print(customer_offers)

    print("✅ Customer sentiment analyzed & selective offers assigned. Data saved in 'customer_offers.json'!")

    return customer_offers[:3]

############################################



# functions of fraud detection

# Function to clean LLM JSON response
def clean_json_response(raw_text):
    """Removes triple backticks and ensures valid JSON format."""
    raw_text = raw_text.strip().strip("```json").strip("```").strip()
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        print("Error decoding JSON. Returning empty response.")
        return {}

# Function to detect fraud using LLM with all transactions


def detect_fraud_transactions(transactions):
    latest_transaction = transactions[-1]  # Last transaction as the latest one
    previous_transactions = transactions[:-1]  # All except last transaction

    # Modified prompt to reduce strictness on first-time transactions
    prompt = f"""
    Analyze the financial transaction history for fraud risk. Allow reasonable variations but flag extreme anomalies.

    **Previous Transactions:**
    {json.dumps(previous_transactions, indent=2)}

    **Latest Transaction:**
    {json.dumps(latest_transaction, indent=2)}

    **Fraud Risk Guidelines:**
    - Do NOT flag a transaction just because it’s unique or the first of its kind.
    - Consider amount, frequency, location, merchant, and historical spending patterns.
    - If the transaction is a slight deviation (e.g., new merchant but similar amount), mark it safe.
    - If it is highly unusual (e.g., very large amount, foreign location, rapid consecutive high-value purchases), flag it.
    - Assign a risk score from 0 to 100 (0 = safe, 100 = highly suspicious).
    - Recommend actions (approve, request verification, block).

    **Respond strictly in JSON format:**
    {{
        "is_fraudulent": True | False,
        "risk_score": "0-100",
        "explanation": "Reason why the latest transaction is flagged or safe.",
        "recommended_action": "Approve | Request Verification"
    }}
    """

    completion = client.chat.completions.create(
        model="google/gemma-3-27b-it:free",
        messages=[{"role": "system", "content": "You are an expert fraud detection assistant. Always respond in valid JSON format."},
                  {"role": "user", "content": prompt}]
    )

    if not completion or not completion.choices:
        print("Error: No response from LLM.")
        return {}

    raw_response = completion.choices[0].message.content.strip()
    print("Raw LLM Response:", raw_response)  # Debugging

    result = clean_json_response(raw_response)
    result["latest_transaction"] = latest_transaction  # Include latest transaction details
    return result


class transaction(BaseModel):
    customer_id: str
    Transaction_Type: str
    Category: str
    Amount: float
    Purchase_Date: str
    Payment_Mode: str
    Merchant_Vendor: str

# -------------------------
# addTransaction Endpoint
# -------------------------

@app.post("/addTransaction")
def addTransaction(input: transaction):

    return_output = None
    Transaction_id = random.randint(1, 99999)  # Generates a number between 100 and 99999

    if input.customer_id.upper().startswith("CUST"):
        category="Retail"
    else:
        category="Commercial"
    
    with open("customer_data.json", "r") as file:
        customer_data = json.load(file)
    
    with open("corporate_data.json", "r") as file:
        corporate_data = json.load(file)
    
    with open("transactions_on_hold.json", "r") as file:
        transactions_on_hold = json.load(file)
    
    transaction = input.dict()
    
    if category=="Retail":
        customer_index = extract_customer_id(input.customer_id)
        #customer_info = customer_data[customer_index-1]
        # Exclude a specific field (e.g., "Merchant/Vendor")
        excluded_field = "customer_id"
        filtered_transaction = {key: value for key, value in transaction.items() if key != excluded_field}
        filtered_transaction["Transaction_id"] =  Transaction_id
        filtered_transaction["Currency"] = "USD"


        ## check for fraud transactions
        all_transactions = customer_data[customer_index-1]["Transactions"].copy()
        all_transactions.append(filtered_transaction)
        fraud_check_result = detect_fraud_transactions(all_transactions)
        return_output = fraud_check_result

        if return_output["is_fraudulent"] is True:
            print("Fraudulent Transaction Detected!")
            transactions_on_hold.append(filtered_transaction)
            print("transcations on hold : ", transactions_on_hold) 
        else:
            print("No Fraud Detected")
            customer_data[customer_index-1]["Transactions"].append(filtered_transaction)
            print(filtered_transaction)
            with open("customer_data.json", "w") as file:
                json.dump(customer_data, file, indent=4) 
            

    else:
        # corporate_info = corporate_data[input.customer_id]
        excluded_field = "customer_id"
        filtered_transaction = {key: value for key, value in transaction.items() if key != excluded_field}
        filtered_transaction["Transaction_id"] =  Transaction_id
        filtered_transaction["Currency"] = "USD"

        ## check for fraud transactions
        all_transactions = corporate_data[input.customer_id]["Transactions"].copy()
        all_transactions.append(filtered_transaction)
        fraud_check_result = detect_fraud_transactions(all_transactions)
        return_output = fraud_check_result

        if return_output["is_fraudulent"] is True:
            print("Fraudulent Transaction Detected!")
            transactions_on_hold.append(filtered_transaction)
            print("transcations on hold : ", transactions_on_hold) 
        else:
            print("No Fraud Detected")
            corporate_data[input.customer_id]["Transactions"].append(filtered_transaction)
            print(corporate_data[input.customer_id]["Transactions"])
            with open("corporate_data.json", "w") as file:
                json.dump(corporate_data, file, indent=4) 
            

    with open("transactions_on_hold.json", "w") as file:
        json.dump(transactions_on_hold, file, indent=4)

    return return_output
       
 
# -------------------------
# Knowledge Endpoint
# -------------------------

@app.post("/getKnowledge")
def getKnowledge(input: LlmRecommendationInput):

    if input.customer_id.upper().startswith("CUST"):
        category="Retail"
    else:
        category="Commercial"
    
    with open("knowledge_customer_comments_data.json", "r") as file:
        customer_data = json.load(file)
    
    with open("corporate_comments_knowledge.json", "r") as file:
        corporate_data = json.load(file)
    
    
    if category=="Retail":
        # customer_index = extract_customer_id(input.customer_id)
        customer_info = customer_data[input.customer_id]

    else:
        corporate_info = corporate_data[input.customer_id]


    # Function to clean LLM JSON response
    def clean_json_response(raw_text):
        """Removes triple backticks and ensures valid JSON format."""
        raw_text = raw_text.strip().strip("```json").strip("```").strip()
        print(raw_text)
        try:
            return json.loads(raw_text)
        except json.JSONDecodeError:
            print("Error decoding JSON. Returning empty response.")
            return {}

    # Function to process a user comment using a single LLM call
    def process_comment(text):
        prompt = f"""
        Analyze the following financial comment and provide the following details in *strict JSON format*:
        
        1. *Sentiment Analysis*: Determine if the sentiment is 'positive', 'neutral', or 'negative'.
        2. *Topic Categorization*: Assign the comment to the most relevant financial topic. Do not restrict to predefined categories; infer the topic naturally.
        3. *Knowledge Recommendation*:
        - If sentiment is *positive*, provide an educational response that encourages growth and investment.
        - If sentiment is *negative*, provide a response focused on risk mitigation and financial security.
        4. *Product Suggestion (Optional)*:
        - If sentiment is *positive or neutral*, suggest a relevant NovaBank product.
        - If sentiment is *negative, do **not* suggest any product.
        - *Do NOT include placeholders like "[Insert Link Here]" or "Visit our website."* Instead, provide a full, self-contained recommendation.

        *Comment*: "{text}"

        *Respond in JSON format*:
        {{
            "sentiment": "positive | neutral | negative",
            "topic": "dynamically inferred topic",
            "knowledge_recommendation": "educational response without placeholders (in 3 sentences max)",
            "product_recommendation": "relevant NovaBank product without placeholders (in 3 sentences max)"
        }}
        """

        completion = client.chat.completions.create(
            model="google/gemma-3-27b-it:free",
            messages=[{"role": "system", "content": "You are an expert financial assistant. Always respond in valid JSON format and provide complete responses without placeholders."},
                    {"role": "user", "content": prompt}]
        )

        if not completion or not completion.choices:
            print("Error: No response from LLM.")
            return {}

        raw_response = completion.choices[0].message.content.strip()
        print("Raw LLM Response:", raw_response)  # Debugging

        return clean_json_response(raw_response)  # Clean & parse JSON safely


    # Process dataset
    if category=="Retail":
        data = customer_info
    else:
        data = corporate_info

    print(data)
    output_data = []
    # for details in data:  # Process first 3 entries
    comment = data["comment"]

    # Get LLM response
    llm_response = process_comment(comment)

    # Store results
    data["customerId"] = input.customer_id  # Add customer ID
    data.update(llm_response)  # Merge LLM-generated data

    output_data.append(data)

    # Save results to a new JSON file
    output_file_path = "customer_sentiment_recommendations.json"
    with open(output_file_path, "w", encoding="utf-8") as output_file:
        json.dump(output_data, output_file, indent=4)

    print(f"Processed data saved to {output_file_path}")
    return output_data



# -------------------------
# login Endpoint
# -------------------------


# Define the request model
class LoginData(BaseModel):
    name: str
    password: str

@app.post("/login")
def login(input: LoginData):
    # Load customer data
    with open("customer_data.json", "r") as file:
        customer_data = json.load(file)

    with open("corporate_data.json", "r") as file:
        corporate_data = json.load(file)

    # Check if user exists and credentials match
    for customer in customer_data:
        if customer["Name"] == input.name and customer["Password"] == input.password:
            print("Logged in as Retail User")
            return {
                "status": True,
                "Customer_Id": customer["Customer_Id"]
            }
        
    for corp_id, corporate in corporate_data.items():
        if corporate["Company Name"] == input.name and corporate["Password"] == input.password:
            print("Logged in as Corporate User")
            return {
                "status": True,
                "Customer_Id": corp_id
            }

        
    print("Invalid credentials")
    return {
        "status": False,
        "Customer_Id": None
    }
 


 # -------------------------
# chatbot Endpoint
# -------------------------

STREAMLIT_URL = "http://localhost:8501"

# Ensure the `.streamlit` config directory exists
CONFIG_DIR = os.path.expanduser("~/.streamlit")
os.makedirs(CONFIG_DIR, exist_ok=True)

# Write Streamlit config file to disable auto-browser
CONFIG_FILE = os.path.join(CONFIG_DIR, "config.toml")
with open(CONFIG_FILE, "w") as f:
    f.write("[server]\nheadless = true\nbrowser.gatherUsageStats = false\n\n[browser]\ngatherUsageStats = false\nserver.headless = true\nserver.enableCORS = false\nserver.enableXsrfProtection = false\nserver.runOnSave = false\nshowErrorDetails = false\n\n[browser]\nserverAddress = \"localhost\"\nserverPort = 8501\nserver.headless = true\nserver.fileWatcherType = \"none\"\nserver.allowRunOnSave = false\nbrowser.serverAddress = \"localhost\"\nserver.runOnSave = false\nshowErrorDetails = false\n\n")

@app.post("/explore")
def launch_chatbot():
    """
    Launch chatbot.py in the background without opening a command window or browser.
    """

    # Set environment variable to prevent Streamlit from opening a browser
    env = os.environ.copy()
    env["STREAMLIT_CONFIG"] = CONFIG_FILE  # Ensure Streamlit loads the config
    env["BROWSER"] = "none"  # Prevent browser launch

    # Run chatbot.py in the background (fully hidden)
    process = subprocess.Popen(
        ["streamlit", "run", "chatbot.py"],
        stdout=subprocess.DEVNULL,  # Suppress logs
        stderr=subprocess.DEVNULL,
        env=env,  # Use modified environment to disable browser opening
        shell=True,
        creationflags=subprocess.CREATE_NO_WINDOW  # Fully hide command window (Windows only)
    )

    # Wait a few seconds to ensure Streamlit starts properly
    time.sleep(5)

    return {"message": "Chatbot launched successfully!", "url": STREAMLIT_URL}

 # -------------------------
# get transactions Endpoint
# -------------------------

class getTranscationData(BaseModel):
    Customer_Id: str


@app.post("/getTransactions")
def login(input: getTranscationData):
    # Load customer data
    with open("customer_data.json", "r") as file:
        customer_data = json.load(file)

    with open("corporate_data.json", "r") as file:
        corporate_data = json.load(file)

    # Check if user exists and credentials match
    for customer in customer_data:
        if customer["Customer_Id"] == input.Customer_Id:
            print("Logged in as Retail User")
            return {
                "status": True,
                "Transactions": customer["Transactions"]
            }
        
    for corp_id, corporate in corporate_data.items():
        if corp_id == input.Customer_Id:
            print("Logged in as Corporate User")
            return {
                "status": True,
                "Transactions": corporate["Transactions"]
            }

        
    print("Invalid credentials")
    return {
        "status": False,
        "Transactions": None
    }


