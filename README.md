<div align="center">

# 🌾 AgroAI - The Smart Selling Advisor

<p align="center">
  <b>From <i>मेहनत</i> to Profit: AI-Powered Market Intelligence for Farmers</b>
</p>

[![Frontend](https://img.shields.io/badge/React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://streamlit.io/)
[![Machine Learning](https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![Status](https://img.shields.io/badge/Status-Live-00C853?style=for-the-badge)]()

### 🌟 [Live Application: agroai-market.vercel.app](https://agroai-market.vercel.app/) 🌟

<br>
<img src="./assets/hero.png" width="100%" alt="AgroAI Hero Interface" />
<br>

[**The Problem**](#-the-problem) • [**Our Solution**](#-our-solution) • [**Tech Stack**](#-tech-stack) • [**Features**](#-key-features) • [**Architecture**](#-architecture) • [**Setup**](#-quick-start-guide)

</div>

---

## 🚨 The Problem

Farmers face severe price uncertainty when deciding to sell their harvest. Because 86% of farmers operate on small margins, even minor price drops can be devastating. Uninformed selling drives distress sales, especially when local markets are flooded post-harvest. Farmers fundamentally lack predictive tools telling them **when** and **where** to sell for maximum profit in an accessible language.

---

## 💡 Our Solution

**AgroAI** is an AI Smart Selling Advisor predicting short-term mandi prices to offer direct, actionable signals. We provide:
- **Price Forecasting:** Predicts upcoming crop prices.
- **Actionable AI:** Clear **SELL**, **HOLD**, or **WAIT** recommendations.
- **Profit Optimization:** Compares local mandis to find the best realized rates.
- **Inclusivity:** Bilingual interface designed for grassroots users.

---

## 🧰 Tech Stack

Our stack is distributed across a robust Python analytical engine and an accessible modern frontend, integrated via intelligent GenAI wrappers.

- ![React + Vite](https://img.shields.io/badge/React%20%2B%20Vite-61DAFB?style=flat&logo=react&logoColor=black) **Frontend:** Multilingual, lightweight user interface deployed for real-time visualization.
- ![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=flat&logo=streamlit&logoColor=white) ![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=flat&logo=scikit-learn&logoColor=white) **Backend & ML Engine:** Handles the Random Forest regression models, interactive data plotting, and price calculation logic. 
- ![LLMs](https://img.shields.io/badge/GenAI-LLMs%20%2F%20OpenRouter-0EA5E9?style=flat&logo=robot&logoColor=white) **GenAI Layer:** Powers the core advisory flows to present complex insights conversationally and natively.
- ![Telegram](https://img.shields.io/badge/Telegram%20Bot-26A5E4?style=flat&logo=telegram&logoColor=white) ![n8n](https://img.shields.io/badge/n8n%20Automation-EA4B71?style=flat&logo=n8n&logoColor=white) **Automation:** A low-friction Telegram bot over 2G/3G allowing farmers to get instant insights without an app install, driven by n8n workflow routing.

---

## 🚀 Key Features

* **Real-Time Forecasting:** Combines historical Agmarknet data and recent trends for a 7-day crop-state forecast.
* **Intelligent Recommendations:** Direct SELL/HOLD/WAIT logic to remove the guesswork.
* **Profit Arbitrage:** Distance-aware market comparisons estimating your actual extra ₹ per kg.
* **Multilingual Access:** Bilingual user flow bridging the digital literacy gap for farmers.
* **WhatsApp & Telegram Bots:** Enables low-friction accessibility on 2G/3G connections without heavy apps.

---

## ⚙️ Architecture

```mermaid
flowchart TD
    A[Agmarknet and Historical Data] --> B[Preprocessing]
    B --> C[Feature Engineering]
    C --> D[RandomForest Models per Crop-State]
    D --> E[Model Storage pkl + metadata]
    E --> F[Prediction Engine 7-day forecast]
    F --> G[Decision Logic SELL HOLD WAIT]
    G --> H[Arbitrage + Risk + Revenue Modules]
    H --> I[Streamlit Backend :8501]
    H --> J[React Frontend :5173]
    J --> K[Farmer Decision Support]
```

Technical highlights:

- Per-combination model loading from pkl artifacts.
- Metadata-based crop-state discovery.
- Cached inference workflow for speed.
- Interactive Plotly visual analytics.

---

## 📁 Project Structure

```text
VIHAAN_DTU/
|-- app.py
|-- offline_train.py
|-- check_accuracy.py
|-- verify_cache.py
|-- requirements.txt
|-- assets/
|-- src/
|-- models/
|-- agmarknet-india-commodity-prices-2024-2025/
`-- Agrow-Ai/
    |-- AgroAIdemo/
    `-- frontend/
        `-- agroai-react/
```

---

## ⚡ Quick Start Guide

### 1. Clone & Setup Repository

```bash
git clone <your-repo-url>
cd DTU_HACK
git lfs install
git lfs pull
```

### 2. Run the React Frontend

```bash
cd frontend/agroai-react
npm install
npm run dev
# The frontend will be available at http://localhost:5173
```

### 3. Run the Streamlit Backend

Open a new terminal session in the project root:

```bash
cd AgroAIdemo
python -m venv .venv

# Activate Virtual Environment (Windows)
.venv\Scripts\activate
# Activate Virtual Environment (macOS/Linux)
# source .venv/bin/activate

pip install -r requirements.txt
python offline_train.py
streamlit run app.py
# The backend will be available at http://localhost:8501
```

> **Note:** The `offline_train.py` script automatically generates local model `.pkl` files inside `AgroAIdemo/models/` using the dataset. Ensure these files are not committed to your repository.

---

<div align="center">
  <b>Crafted with ❤️</b><br>
  <i>Data-Driven Agriculture. Inclusive by Design.</i>
</div>