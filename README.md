# HyperFin AI for Nova Bank

## 📌 Project Overview
HyperFin AI is an intelligent, modular platform designed to deliver truly personalized banking experiences. It goes beyond static customer profiles by analyzing user sentiment, behavior, and financial needs. Developed for Nova Bank by Team Git Rekt, this system integrates large language models (LLMs) and machine learning models to provide smart recommendations, proactive retention strategies, fraud detection, and sentiment-aware engagement.

## 🚀 Features
- **Smart Product Recommendations** (LLM + KNN)
- **Retention Offer Engine** (Sentiment + Churn Risk-Based)
- **LLM-Powered Financial Q&A Assistant**
- **Fraud Detection** with Transparent Reasoning
- **Real-Time User Behavior Tracking** (via Fund Transfers)
- **Social Media-Based Trivia & Product Recommendations**
- **ML Fallback Engine** for Resilience (XGBoost, KNN)
- **Customer & Admin Dashboards** (React + Tailwind)
- **FastAPI Backend** with RESTful Endpoints

## 🧠 AI Models Used
- **Gemma 3 27B** – Primary LLM for reasoning, Q&A, and engagement
- **XGBoost** – Churn prediction based on transactions and sentiment analysis
- **KNN** – Similarity-based personalized product recommendations

## 📂 Datasets
All datasets are synthetic, privacy-safe, and structured to simulate real-world banking use cases:
- `corporate_comments_knowledge.json`
- `corporate_data.json`
- `customer_data.json`
- `knowledge_customer_comments_data`
- `nova_bank_comments.json`
- `retention_offers.json`
- `loyalty_rewards.json`

## 🗂 Project Structure
```bash
aidhp-git-rekt/
├── backend/           # FastAPI backend with ML & LLM logic
│   ├── data/         # Dataset storage
│   ├── main.py       # FastAPI main application file
│   ├── models/       # Machine learning models
│   └── tests/        # Pytest test cases
│
├── frontend/          # React + Tailwind frontend
│   ├── src/          # React source code
│   ├── public/
│   ├── assets/       # Static files (images, fonts, etc.)
│
├── Requirements.txt   # Python dependencies and test requirements
└── README.md          # Project documentation
```

## ⚙️ Installation & Setup
### 1. Clone the Repository:
```bash
git clone https://github.com/ewfx/aidhp-git-rekt.git
cd aidhp-git-rekt
```
### 2. Backend Setup:
```bash
# Create and activate a virtual environment
python -m venv env
./env/Scripts/activate  # Windows
# For macOS/Linux use: source env/bin/activate

# Install dependencies
pip install -r requirements.txt

cd code/backend
uvicorn main:app --reload
```
### 3. Frontend Setup:
```bash
# Open a new terminal in the aidhp-git-rekt folder
cd code/Frontend
npm install
npm start
```
### 4. Open the Application:
- Navigate to: `http://localhost:3000`

## ✅ Testing
- Run all tests using (pls go respective testing folder):
```bash
pytest tests/
```
- Includes unit tests for backend functionality.

## 📊 Performance Benchmarks
| Component | Performance |
|-----------|------------|
| **Gemma 3 27B (LLM)** | Avg response: ~5s, 95th percentile: ~3.4s |
| **XGBoost** | Inference: ~25ms, AUC-ROC: 0.93 |
| **KNN** | Inference: ~18ms, Precision@5: 74% |


## 🔒 Security & Compliance
- **TLS-Encrypted API Traffic**
- **Role-Based Endpoint Security**

## 📎 License
This project is intended for innovation and educational use only. All data is synthetic. Not intended for production use without validation and review.

## 🤝 Contact
Built by **Team Git Rekt** for internal hackathons and innovation projects.
- **GitHub:** [https://github.com/ewfx/aidhp-git-rekt](https://github.com/ewfx/aidhp-git-rekt)

