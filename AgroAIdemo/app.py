import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import pickle
import time
import os
import json
import glob
import hashlib
import subprocess
import sys
from pathlib import Path
from urllib.parse import quote_plus

from src.predict import predict_future

st.set_page_config(layout="wide", page_title="🌾 AgroAI Smart Selling Advisor")

BRAND = "#84CC16"
BRAND_LIGHT = "#BEF264"
WARN = "#F59E0B"
DANGER = "#EF4444"
REACT_APP_URL = os.getenv("REACT_APP_URL", "http://localhost:5173")
BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
METADATA_PATH = MODELS_DIR / "metadata.json"
AUTO_TRAIN_IF_MISSING = os.getenv("AUTO_TRAIN_IF_MISSING", "1") == "1"

# --- PRO-LEVEL UI CSS INJECTION ---
def load_css():
    css_path = BASE_DIR / "assets" / "style.css"
    if os.path.exists(css_path):
        with open(css_path) as f:
            st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
load_css()
# -----------------------------------


def ensure_models_available():
    has_metadata = METADATA_PATH.exists()
    has_model_files = any(MODELS_DIR.glob("*.pkl"))
    if has_metadata or has_model_files:
        return

    if not AUTO_TRAIN_IF_MISSING:
        st.error("❌ No model metadata or model files found on server.")
        st.info("Set AUTO_TRAIN_IF_MISSING=1 or generate models in AgroAIdemo/models/ before deployment.")
        st.stop()

    if st.session_state.get("auto_train_failed", False):
        st.error("❌ Model auto-training failed on a previous attempt.")
        if st.button("Retry Model Training"):
            st.session_state["auto_train_failed"] = False
            st.rerun()
        st.stop()

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    with st.spinner("No models found. Running one-time training on server (this can take several minutes)..."):
        result = subprocess.run(
            [sys.executable, str(BASE_DIR / "offline_train.py")],
            cwd=str(BASE_DIR),
            capture_output=True,
            text=True,
        )

    if result.returncode != 0:
        st.session_state["auto_train_failed"] = True
        st.error("❌ Auto-training failed. Check logs below.")
        with st.expander("Training logs"):
            logs = (result.stdout or "") + "\n" + (result.stderr or "")
            st.code(logs[-12000:])
        st.stop()

    st.success("✅ Model training completed. Reloading app...")
    st.rerun()


def render_kpi_card(title, value, subtitle="", tone="neutral"):
    subtitle_html = f'<div class="kpi-sub">{subtitle}</div>' if subtitle else ""
    st.markdown(
        f"""
        <div class="kpi-card tone-{tone}">
            <div class="kpi-label">{title}</div>
            <div class="kpi-value">{value}</div>
            {subtitle_html}
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_section_open(title, icon=""):
    icon_html = f"<span class='section-icon'>{icon}</span>" if icon else ""
    st.markdown(
        f"""
        <section class="section-shell">
            <h3 class="section-title">{icon_html}{title}</h3>
        """,
        unsafe_allow_html=True,
    )


def render_section_close():
    st.markdown("</section>", unsafe_allow_html=True)


st.markdown(
    f"""
    <div style="display:flex;justify-content:space-between;align-items:center;">
        <div class="agroai-header fade-in">
            <div class="agroai-title">AgroAI Forecast Studio</div>
            <div class="agroai-subtitle">AI Smart Selling Advisor</div>
            <div class="agroai-underline"></div>
        </div>
        <a href="{REACT_APP_URL}/?return=1" target="_parent" style="text-decoration:none;">
            <button style="background-color:#84CC16;color:#0C100C;border:none;padding:10px 20px;border-radius:30px;font-weight:bold;cursor:pointer;box-shadow:0 0 15px rgba(132,204,22,0.4);font-family:sans-serif;">
                &larr; Back to AgroAI
            </button>
        </a>
    </div>
    """,
    unsafe_allow_html=True
)

# Load available combinations instantly from metadata
@st.cache_data(show_spinner=False)
def load_metadata():
    with open(METADATA_PATH, "r") as f:
        return json.load(f)

ensure_models_available()

try:
    available_combos = load_metadata()
except FileNotFoundError:
    available_combos = {}
    model_files = glob.glob(str(MODELS_DIR / "*.pkl"))
    for model_file in model_files:
        base_name = os.path.basename(model_file)
        if base_name == "all_models.pkl":
            continue
        name = base_name.replace(".pkl", "")
        if "_" not in name:
            continue
        crop_name, state_name = name.rsplit("_", 1)
        if crop_name not in available_combos:
            available_combos[crop_name] = []
        available_combos[crop_name].append(state_name)
    if not available_combos:
        st.error("❌ No model metadata or per-combo models found. Please run `python offline_train.py` first.")
        st.stop()
    st.warning("⚠️ metadata.json not found. Using model files to build crop/state list.")

# Mobile-first mode toggle logic (can be overridden with ?mobile=0 or ?mobile=1)
query_mobile = st.query_params.get("mobile", None)
if query_mobile is None:
    is_mobile = st.session_state.get("is_mobile", True)
else:
    is_mobile = str(query_mobile).lower() in {"1", "true", "yes", "y"}
st.session_state["is_mobile"] = is_mobile

if is_mobile:
    st.markdown(
        """
        <div id="mobile-controls-anchor"></div>
        <div class="mobile-control-header">📍 Prediction Controls</div>
        """,
        unsafe_allow_html=True,
    )

    with st.expander("🌾 Prediction Controls", expanded=False):
        st.markdown("<div class='mobile-controls-card'>", unsafe_allow_html=True)
        crop = st.selectbox("🌽 Select Crop", sorted(available_combos.keys()), key="mobile_crop")
        state = st.selectbox("📍 Select State", sorted(available_combos[crop]), key="mobile_state")
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown(
        """
        <a href="#mobile-controls-anchor" class="mobile-fab" title="Change Crop">
            ⚙️ Change Crop
        </a>
        """,
        unsafe_allow_html=True,
    )
else:
    st.sidebar.markdown("<div class='sidebar-panel-title'>Prediction Controls</div>", unsafe_allow_html=True)
    crop = st.sidebar.selectbox("🌽 Select Crop", sorted(available_combos.keys()), key="sidebar_crop")
    state = st.sidebar.selectbox("📍 Select State", sorted(available_combos[crop]), key="sidebar_state")

# Persist latest selection
st.session_state["last_crop"] = crop
st.session_state["last_state"] = state
react_return_url = (
    f"{REACT_APP_URL}/?return=1&crop={quote_plus(crop)}&state={quote_plus(state)}"
)

# LAZY LOAD ONLY REQUIRED MODEL
@st.cache_data(show_spinner=False, max_entries=10)
def load_single_model(selected_crop, selected_state):
    safe_crop = selected_crop.replace('/', '_').replace('\\', '_')
    safe_state = selected_state.replace('/', '_').replace('\\', '_')
    model_path = MODELS_DIR / f"{safe_crop}_{safe_state}.pkl"
    with open(model_path, 'rb') as f:
        return pickle.load(f)

try:
    start_load = time.time()
    with st.spinner("Fetching pre-trained model..."):
        model_data = load_single_model(crop, state)
    elapsed = time.time() - start_load
    if is_mobile:
        st.markdown(
            f"<div class='mobile-summary'>📍 {crop} • {state}</div>",
            unsafe_allow_html=True,
        )
        st.markdown(
            f"<div class='mobile-status mobile-status-good'>⚡ Loaded in {elapsed:.3f}s</div>",
            unsafe_allow_html=True,
        )
    else:
        st.sidebar.markdown(
            f"<div class='sidebar-chip sidebar-chip-good'>⚡ Loaded in {elapsed:.3f}s</div>",
            unsafe_allow_html=True,
        )
except FileNotFoundError:
    st.error(f"❌ No trained model found for {crop} in {state}. Please retrain.")
    st.stop()

model = model_data['model']
df_feat = model_data['df_feat']
r2_train = model_data['r2_train']
r2_test = model_data['r2_test']
mae_test = model_data['mae_test']
rmse_test = model_data['rmse_test']
total_points = model_data['total_points']
features = model_data['features']

if is_mobile:
    st.markdown(
        f"<div class='mobile-status'>R² (test): {r2_test:.2%}</div>",
        unsafe_allow_html=True,
    )
else:
    st.sidebar.markdown(
        f"<div class='sidebar-chip'>R² (test): {r2_test:.2%}</div>",
        unsafe_allow_html=True,
    )

# Make predictions (NO training!)
future_preds = predict_future(model, df_feat)

# Convert from per quintal to per KG (1 quintal = 100 KG)
current_price = df_feat['price'].iloc[-1] / 100
predicted_price = np.mean(future_preds) / 100
future_preds_kg = [p / 100 for p in future_preds]

if predicted_price >= current_price * 1.02:
    decision = "SELL"
elif predicted_price >= current_price * 0.98:
    decision = "HOLD"
else:
    decision = "WAIT"

risk_val = df_feat['price'].std() / 100
risk = "HIGH" if risk_val > 2 else "MEDIUM" if risk_val > 1 else "LOW"

last7 = df_feat.tail(7)['price'].mean()
prev7 = df_feat.tail(14).head(7)['price'].mean()
trend = "Increasing" if last7 > prev7 else "Decreasing"

latest = df_feat['date'].max()
df_today = df_feat[df_feat['date'] == latest]
best_mandi = df_today.sort_values('price', ascending=False).head(1)['mandi'].values[0]

decision_tone = "good" if decision == "SELL" else "warn" if decision == "HOLD" else "bad"
risk_tone = "bad" if risk == "HIGH" else "warn" if risk == "MEDIUM" else "good"

# Accuracy section
render_section_open("Model Accuracy & Performance", "📊")
metric_cols = st.columns(4)

with metric_cols[0]:
    render_kpi_card("R2 Score (Test)", f"{r2_test:.2%}", f"vs train {r2_train:.2%}", "good")
with metric_cols[1]:
    render_kpi_card("MAE", f"₹{mae_test / 100:.2f}/KG", tone="neutral")
with metric_cols[2]:
    render_kpi_card("RMSE", f"₹{rmse_test / 100:.2f}/KG", tone="neutral")
with metric_cols[3]:
    render_kpi_card("Data Points", f"{total_points}", tone="neutral")

render_section_close()

# Prediction section
render_section_open("Price Prediction & Recommendation", "💹")
pred_cols = st.columns(4)

with pred_cols[0]:
    render_kpi_card("Current Price", f"₹{current_price:.2f}/KG", f"{crop} @ {state}", "neutral")
with pred_cols[1]:
    render_kpi_card("Predicted Price (7D)", f"₹{predicted_price:.2f}/KG", tone="good")
with pred_cols[2]:
    render_kpi_card("Decision", decision, "AI recommendation", decision_tone)
with pred_cols[3]:
    render_kpi_card("Risk Level", risk, f"Std dev: ₹{risk_val:.2f}/KG", risk_tone)

render_section_close()

# Multi-Market Arbitrage Tracker (demo-safe simulated nearby markets)
render_section_open("Multi-Market Arbitrage Tracker", "📍")

with st.spinner("Scanning nearby markets for better margins..."):
    seed_text = f"{crop}|{state}|{predicted_price:.4f}"
    seed_value = int(hashlib.sha256(seed_text.encode("utf-8")).hexdigest()[:8], 16)
    rng = np.random.default_rng(seed_value)

    # Prefer real mandi names from dataset; fallback gracefully if unavailable.
    if "mandi" in df_feat.columns and df_feat["mandi"].notna().any():
        mandi_df = df_feat.dropna(subset=["mandi", "price"]).copy()
        mandi_df["mandi"] = mandi_df["mandi"].astype(str).str.strip()
        mandi_df = mandi_df[mandi_df["mandi"] != ""]

        if not mandi_df.empty:
            latest_by_mandi = (
                mandi_df.sort_values("date")
                .groupby("mandi", as_index=False)
                .tail(1)
            )
            local_market_name = mandi_df["mandi"].value_counts().idxmax()
            local_row = latest_by_mandi[latest_by_mandi["mandi"] == local_market_name]
            local_latest_price_kg = (
                float(local_row["price"].iloc[0]) / 100
                if not local_row.empty
                else predicted_price
            )

            other_markets = (
                latest_by_mandi[latest_by_mandi["mandi"] != local_market_name]
                .sort_values("price", ascending=False)["mandi"]
                .head(3)
                .tolist()
            )

            market_names = [local_market_name] + other_markets
            # Ensure we still show up to 4 entries using any remaining real mandis.
            if len(market_names) < 4:
                extras = [
                    m
                    for m in latest_by_mandi["mandi"].tolist()
                    if m not in market_names
                ]
                market_names.extend(extras[: 4 - len(market_names)])

            # If dataset is too small, fall back to safe labels for missing slots.
            while len(market_names) < 4:
                market_names.append(f"{state} Market {len(market_names)}")

            forecast_factor = (
                predicted_price / local_latest_price_kg
                if local_latest_price_kg > 0
                else 1.0
            )

            predicted_market_prices = []
            for i, market in enumerate(market_names):
                row = latest_by_mandi[latest_by_mandi["mandi"] == market]
                base_market_price_kg = (
                    float(row["price"].iloc[0]) / 100
                    if not row.empty
                    else predicted_price
                )

                # Keep local market aligned with main prediction; vary nearby markets moderately.
                if i == 0:
                    predicted_market_prices.append(round(predicted_price, 2))
                else:
                    variation = float(rng.uniform(-0.06, 0.12))
                    simulated_price = max(
                        0.1,
                        base_market_price_kg * forecast_factor * (1 + variation),
                    )
                    predicted_market_prices.append(round(simulated_price, 2))

            distances = [0]
            for _ in range(1, len(market_names)):
                distances.append(int(rng.integers(10, 60)))
        else:
            market_names = [f"{state} Local Mandi", f"{state} Market A", f"{state} Market B", f"{state} Market C"]
            distances = [0, 15, 32, 47]
            multipliers = [1.0, 1 + float(rng.uniform(-0.05, 0.10)), 1 + float(rng.uniform(0.03, 0.15)), 1 + float(rng.uniform(-0.04, 0.12))]
            predicted_market_prices = [round(predicted_price * m, 2) for m in multipliers]
    else:
        market_names = [f"{state} Local Mandi", f"{state} Market A", f"{state} Market B", f"{state} Market C"]
        distances = [0, 15, 32, 47]
        multipliers = [1.0, 1 + float(rng.uniform(-0.05, 0.10)), 1 + float(rng.uniform(0.03, 0.15)), 1 + float(rng.uniform(-0.04, 0.12))]
        predicted_market_prices = [round(predicted_price * m, 2) for m in multipliers]

    arbitrage_df = pd.DataFrame(
        {
            "Market": market_names,
            "Distance (km)": distances,
            "Predicted Price (₹/KG)": predicted_market_prices,
        }
    )

best_idx = int(arbitrage_df["Predicted Price (₹/KG)"].idxmax())
best_row = arbitrage_df.iloc[best_idx]
local_price = float(arbitrage_df.iloc[0]["Predicted Price (₹/KG)"])
best_price = float(best_row["Predicted Price (₹/KG)"])
gain = round(best_price - local_price, 2)

chart_shell_cols = st.columns([3, 2])

with chart_shell_cols[0]:
    st.markdown("<div class='chart-shell'><div class='chart-title'>Market vs Predicted Price</div>", unsafe_allow_html=True)
    bar_colors = ["rgba(190,242,100,0.35)"] * len(arbitrage_df)
    bar_colors[best_idx] = BRAND

    fig3 = px.bar(
        arbitrage_df,
        x="Market",
        y="Predicted Price (₹/KG)",
        text="Predicted Price (₹/KG)",
    )
    fig3.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#E6EDF3", family="Inter"),
        margin=dict(l=0, r=0, t=30, b=0),
        xaxis=dict(showgrid=False, zeroline=False),
        yaxis=dict(showgrid=True, gridcolor="rgba(255,255,255,0.08)", title="₹/KG"),
        showlegend=False,
    )
    fig3.update_traces(
        marker_color=bar_colors,
        marker_line_color="rgba(255,255,255,0.18)",
        marker_line_width=1,
        texttemplate="₹%{text:.2f}",
        textposition="outside",
    )
    st.plotly_chart(fig3, use_container_width=True, key="chart_arbitrage")
    st.markdown("</div>", unsafe_allow_html=True)

with chart_shell_cols[1]:
    drive_text = (
        f"Drive {int(best_row['Distance (km)'])} km for +₹{gain:.2f}/KG profit"
        if gain > 0
        else "Local mandi is already the best option today."
    )
    market_lines = "".join(
        [
            f"<div class='arbitrage-line'><span>{row['Market']}</span><span>₹{row['Predicted Price (₹/KG)']:.2f} • {int(row['Distance (km)'])} km</span></div>"
            for _, row in arbitrage_df.iterrows()
        ]
    )

    st.markdown(
        f"""
        <div class="arbitrage-card">
            <div class="arbitrage-badge">🔥 Best Market to Sell</div>
            <div class="arbitrage-market">{best_row['Market']}</div>
            <div class="arbitrage-price">₹{best_price:.2f}/KG</div>
            <div class="arbitrage-drive">🚗 {drive_text}</div>
            <div class="arbitrage-gain">💡 You can earn ₹+{max(gain, 0):.2f}/KG more vs local mandi.</div>
            <div class="arbitrage-lines-wrap">{market_lines}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

render_section_close()

# Charts section
render_section_open("Market Trend Visuals", "📈")
chart_cols = st.columns(2)

with chart_cols[0]:
    st.markdown("<div class='chart-shell'><div class='chart-title'>Last 30 Days Price Trend</div>", unsafe_allow_html=True)
    price_data = df_feat.tail(30).copy()
    price_data['price_kg'] = price_data['price'] / 100
    fig = px.line(
        price_data,
        x='date',
        y='price_kg',
        title=f"{crop} Price Trend in {state}",
        labels={'price_kg': 'Price (₹/KG)', 'date': 'Date'}
    )
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#E6EDF3", family="Inter"),
        margin=dict(l=0, r=0, t=40, b=0),
        title_font=dict(size=16),
        xaxis=dict(showgrid=False, zeroline=False),
        yaxis=dict(showgrid=True, gridcolor="rgba(255,255,255,0.08)")
    )
    fig.update_traces(
        line=dict(color=BRAND, width=3),
        fill='tozeroy',
        fillcolor='rgba(132,204,22,0.15)',
        mode='lines+markers',
        marker=dict(size=4, color=BRAND_LIGHT)
    )
    st.plotly_chart(fig, use_container_width=True, key='chart1')
    st.markdown("</div>", unsafe_allow_html=True)

with chart_cols[1]:
    st.markdown("<div class='chart-shell'><div class='chart-title'>7-Day Future Forecast</div>", unsafe_allow_html=True)
    pred_df = pd.DataFrame({
        'Days Ahead': list(range(1, 8)),
        'Predicted Price (₹/KG)': future_preds_kg
    })
    fig2 = px.line(
        pred_df,
        x='Days Ahead',
        y='Predicted Price (₹/KG)',
        title="Next 7 Days Price Forecast",
        labels={'Predicted Price (₹/KG)': 'Price (₹/KG)'}
    )
    fig2.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#E6EDF3", family="Inter"),
        margin=dict(l=0, r=0, t=40, b=0),
        title_font=dict(size=16),
        xaxis=dict(showgrid=False, zeroline=False),
        yaxis=dict(showgrid=True, gridcolor="rgba(255,255,255,0.08)")
    )
    fig2.update_traces(
        line=dict(color="#A3E635", width=3),
        fill='tozeroy',
        fillcolor='rgba(163,230,53,0.14)',
        mode='lines+markers',
        marker=dict(size=5, color="#D9F99D")
    )
    st.plotly_chart(fig2, use_container_width=True, key='chart2')
    st.markdown("</div>", unsafe_allow_html=True)

render_section_close()

# Insights section
render_section_open("Action Insights", "🧠")
info_cols = st.columns(2)

with info_cols[0]:
    st.markdown(
        f"""
        <div class="insight-card tone-good">
            <div class="insight-title">Best Mandi Today</div>
            <div class="insight-value">{best_mandi}</div>
            <div class="insight-sub">Trend: {trend}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

with info_cols[1]:
    st.markdown(
        f"""
        <div class="insight-card tone-{risk_tone}">
            <div class="insight-title">Risk & Recommendation</div>
            <div class="insight-value">{risk} RISK</div>
            <div class="insight-sub">Recommended action: {decision}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

render_section_close()

# Revenue calculator
render_section_open("Revenue Calculator", "💰")
qty_kg = st.slider("Quantity (KG)", 1, 1000, 100)
expected_revenue = predicted_price * qty_kg
st.markdown(
    f"""
    <div class="revenue-shell">
        <div class="revenue-label">Estimated 7-day Revenue</div>
        <div class="revenue-value">₹{expected_revenue:,.2f}</div>
        <div class="revenue-sub">Based on {qty_kg} KG at ₹{predicted_price:.2f}/KG</div>
    </div>
    """,
    unsafe_allow_html=True,
)
render_section_close()
