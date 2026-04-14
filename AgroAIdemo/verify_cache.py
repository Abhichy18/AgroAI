import streamlit as st
import pandas as pd
import time

from src.data_preprocessing import load_and_clean_data
from src.feature_engineering import create_features
from src.train_model import train_model
from src.config import DATASET_PATH
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import numpy as np

st.set_page_config(layout="wide", page_title="🌾 Cache Verification")

st.title("🔍 Model Training Cache Verification")

# Load data - cached once
@st.cache_data
def load_data():
    st.write("⏳ Loading data...")
    return load_and_clean_data(DATASET_PATH)

df = load_data()

# Cache the model training with timing
@st.cache_data
def get_trained_model(crop, state):
    start = time.time()
    st.write(f"⏳ Training model for {crop} in {state}...")
    
    df_crop = df[(df['crop'] == crop) & (df['state'] == state)]
    
    if len(df_crop) < 20:
        return None, None, None, None, None, None, None, 0
    
    df_feat = create_features(df_crop)
    
    features = ['day','month','day_of_week','lag1','lag2','lag3','roll3','roll7']
    
    X = df_feat[features]
    y = df_feat['price']
    
    split = int(len(df_feat)*0.8)
    
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    
    # Train model
    model = train_model(X_train, y_train)
    
    # Get predictions
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)
    
    # Calculate metrics
    r2_train = r2_score(y_train, y_pred_train)
    r2_test = r2_score(y_test, y_pred_test)
    mae_test = mean_absolute_error(y_test, y_pred_test)
    rmse_test = np.sqrt(mean_squared_error(y_test, y_pred_test))
    
    elapsed = time.time() - start
    return model, df_feat, r2_train, r2_test, mae_test, rmse_test, len(df_feat), elapsed

crop = st.sidebar.selectbox("🌽 Select Crop", df['crop'].unique())
state = st.sidebar.selectbox("📍 Select State", df['state'].unique())

st.info("💡 Try changing crop/state combinations. If cache is working, you'll see:")
st.info("✅ NEW selection = Training happens (slow)")
st.info("✅ SAME selection again = Uses cache (instant, no 'Training model' message)")

model, df_feat, r2_train, r2_test, mae_test, rmse_test, total_points, train_time = get_trained_model(crop, state)

if model is None:
    st.error("❌ Not enough data")
else:
    st.success(f"✅ Model trained in {train_time:.2f} seconds")
    
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("R² Score", f"{r2_test:.2%}")
    col2.metric("MAE", f"₹{mae_test/100:.2f}/KG")
    col3.metric("RMSE", f"₹{rmse_test/100:.2f}/KG")
    col4.metric("Data Points", total_points)
    
    st.info("👉 Select the SAME crop-state again. It should load instantly from cache (no training message)!")
