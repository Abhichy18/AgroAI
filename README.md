<div align="center">

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Sheaf%20of%20Rice.png" alt="Rice" width="45" /> AgroAI - The Smart Selling Advisor

<p align="center">
  <b>Empowering Farmers with Next-Gen AI-Driven Market Insights & Profit Maximization</b>
</p>

[![Frontend](https://img.shields.io/badge/React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://streamlit.io/)
[![Machine Learning](https://img.shields.io/badge/Scikit_Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Python](https://img.shields.io/badge/Python_3.9-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![Status](https://img.shields.io/badge/Status-Live-00C853?style=for-the-badge)]()

[**The Problem**](#-the-problem) • [**Our Solution**](#-our-solution) • [**Key Features**](#-key-features) • [**Streamlit Engine**](#%EF%B8%8F-streamlit-ai-engine) • [**WhatsApp Bot**](#-whatsapp-bot-integration)

</div>

---

## 🚨 The Problem

Every year, farmers face tremendous financial uncertainty. They plant crops without knowing what the market price will be at harvest time. **Lack of predictive insights** forces them to sell blindly, often in local markets saturated with the same crop, leading to devastating price crashes and significant losses.
- **No Market Foresight:** Selling decisions are based on luck or outdated trends.
- **Language Barriers:** Existing analytical tech solutions are primarily in English, alienating the actual users.
- **Low Accessibility:** Many farmers do not own high-end smartphones or stable internet connections to run heavy web dashboards.

---

## 💡 Our Solution

**AgroAI** is built to bridge the gap between advanced Machine Learning and the grassroots agricultural community. We shift the paradigm from *“growing and hoping”* to **“predicting and profiting”**.
    
By analyzing massive datasets of historical **Agmarknet commodity prices (2024-2025)**, our AI acts as a smart advisor:
1. **Predicts** future prices up to 6 months in advance.
2. **Recommends** the exact state and month to sell for maximum margins.
3. **Delivers** these insights via a blazing-fast Multilingual React Dashboard AND an upcoming/integrated scalable WhatsApp Bot, ensuring zero friction for the end-user.

---

## 🚀 Key Features

### 🌐 Multilingual Support (Built for Farmers)
Technology is useless if the end-user cannot read it. AgroAI's frontend is fully i18n-ready, featuring **dynamic toggling between native languages** (Hindi, English, etc.) via custom translation dictionaries. Farmers can interact with price trends entirely in their mother tongue.

### 💬 WhatsApp Bot Integration
To tackle the smartphone and internet barrier directly, AgroAI connects the ML backend with **WhatsApp**:
- **Zero Learning Curve:** Farmers just text *"Bajra in UP"* and the bot instantly replies with future price predictions and best-selling advice.
- **Universal Accessibility:** Works on low-end devices and even with poor 2G/3G network connections.

### 💻 Modern React Dashboard
- **Bento-Grid UI:** Fluid and intuitive visual layout adapting perfectly to Mobiles, Tablets, and Desktop screens.
- **Smart Prediction Cards:** Bite-sized actionable insights (Commodity metrics, optimal selling dates).
- **Real-time Analytics Overlay:** Simulated loading overlays offering beautiful visual feedback during large data fetches.

---

## ⚙️ Streamlit AI Engine & Backend

The heavy analytical lifting of AgroAI is powered by an industrialized Python-Streamlit architecture.

- 🧠 **Intelligent State-wise Modeling:** Trains individual Random Forest Regressor models *per commodity, per state*, minimizing regional outliers and maximizing localized accuracy.
- 📈 **Dynamic Visualizations:** Generates rich, interactive graphs via `Plotly.express` comparing historical prices against 6-month projected data across regions.
- 💹 **Profit Maximizer Module:** Cross-calculates predicted values across different markets to suggest the absolute highest profitable "State + Month" combination.
- ⚡ **Extensive Caching & Checksums:** Employs `.pkl` model caching and `hashlib` state-checking to prevent redundant training, accelerating inference speed by over 95%.

---

<div align="center">
  <br>
  <b>Crafted with ❤️ for the DTU Hackathon</b><br>
  <i>Bringing Data-Driven Agriculture to the Masses</i>
</div>