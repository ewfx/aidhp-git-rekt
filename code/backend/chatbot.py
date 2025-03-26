import streamlit as st
import json
from openai import OpenAI

# OpenRouter API Key
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"
)

with open("rules.json", "r") as file:
    nova_bank_data = json.load(file)

# Function to process user input and generate responses
def get_financial_advice(user_query):
    system_prompt = f"""
    You are NovaBank's AI financial assistant, dedicated to providing **clear, structured, and actionable financial insights**. Your primary goal is to assist users with finance-related queries while keeping responses relevant and to the point.

    **🔹 Response Rules:**
    - **For Greetings (e.g., "Hi", "Hello")** → Keep it brief and natural, e.g., "Hello! How can I assist you today?"
    - **For Financial Queries** → Provide well-structured responses using bullet points, numbered steps, or short paragraphs.
    - **STRICTLY finance-related responses ONLY** → If a user asks about unrelated topics (e.g., cars, sports, movies), respond with:  
      👉 *"I specialize in financial advice. How can I assist with banking, savings, or investments?"*
    - **No external links for NovaBank services should be provided.**  
    - **Mention NovaBank services only if they directly align with the user's question.**  

    **💡 Example Scenarios:**
    - **User:** "Hi"  
      **Response:** "Hello! How can I assist you today?"
    - **User:** "How do I start investing?"  
      **Response:**  
        - **Step 1:** Determine your investment goals (short-term or long-term).  
        - **Step 2:** Choose an investment type (stocks, bonds, mutual funds).  
        - **Step 3:** Assess your risk tolerance and diversify your portfolio.  
        - **NovaBank Offer (if relevant):** "NovaBank provides investment advisory services to help you get started."  
    - **User:** "What is the fastest car?"  
      **Response:** "I specialize in financial topics. How can I assist with banking, savings, or investments?"  

    **🔍 Now, answer the user's query while following these guidelines strictly.**
"""


    response = client.chat.completions.create(
        model="google/gemma-3-27b-it:free",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_query}
        ],
        temperature=0.5
    )

    return response.choices[0].message.content





# Streamlit UI Configuration
st.set_page_config(page_title="NovaBank Financial Assistant", layout="wide")

# Sidebar for settings
with st.sidebar:
    st.title("⚙️ Settings")
    if st.button("🗑️ Clear Chat History"):
        st.session_state.messages = []
        st.success("Chat history cleared!")

    st.markdown("---")
    st.write("💡 **Ask me about:**")
    st.write("- Financial Planning")
    st.write("- Savings & Investments")
    st.write("- NovaBank Services")
    st.write("- Loans & Retirement Plans")

# Main Chat UI
st.title("💰 NovaBank Financial Assistant")
st.write("Chat with NovaBank’s AI for financial guidance.")

# Initialize chat history if not present
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# User input
user_input = st.chat_input("Ask me about financial planning...")

if user_input:
    # Add user message
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)
    
    # Placeholder for assistant's response
    bot_message_placeholder = st.chat_message("assistant").empty()

    # Show bot response with loading spinner
    with bot_message_placeholder:
        with st.spinner("🤔 Thinking..."):
            bot_response = get_financial_advice(user_input)

    # Store response and display it
    st.session_state.messages.append({"role": "assistant", "content": bot_response})
    bot_message_placeholder.markdown(bot_response)
