"""
Train model ONCE and save it (offline training)
Run this once, model gets saved, then app.py just loads and predicts!
"""

import pandas as pd
import numpy as np
import pickle
import os
import json
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

from src.data_preprocessing import load_and_clean_data
from src.feature_engineering import create_features
from src.train_model import train_model
from src.config import DATASET_PATH

print("\n" + "="*70)
print("🌾 OFFLINE MODEL TRAINING - ONE TIME ONLY")
print("="*70)

# Load data
print("\n📚 Loading data...")
df = load_and_clean_data(DATASET_PATH)

# Create models directory
os.makedirs("models", exist_ok=True)

# Train a model for each crop-state combination and save
print("\n🔧 Training models for all crop-state combinations...")

available_combos = {}
crop_count = 0

# Train all crops
all_crops = df['crop'].unique()
print(f"   Training {len(all_crops)} crops")

for i, crop in enumerate(all_crops):
    print(f"\n[{i+1}/{len(all_crops)}] Processing {crop}...")
    
    states = df[df['crop'] == crop]['state'].unique()
    
    for state in states:
        try:
            df_crop = df[(df['crop'] == crop) & (df['state'] == state)]
            
            if len(df_crop) < 20:
                continue
            
            key = f"{crop}|{state}"
            
            # Feature engineering
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
            
            # Store model data
            model_data = {
                'model': model,
                'df_feat': df_feat,
                'r2_train': r2_train,
                'r2_test': r2_test,
                'mae_test': mae_test,
                'rmse_test': rmse_test,
                'total_points': len(df_feat),
                'features': features
            }
            
            # ✅ FIX: Save each model to its own file instead of one giant file
            safe_crop = crop.replace('/', '_').replace('\\', '_')
            safe_state = state.replace('/', '_').replace('\\', '_')
            model_file_path = f"models/{safe_crop}_{safe_state}.pkl"
            
            with open(model_file_path, 'wb') as f:
                pickle.dump(model_data, f)
            
            # Record combination in metadata
            if crop not in available_combos:
                available_combos[crop] = []
            available_combos[crop].append(state)
            
            crop_count += 1
            print(f"   ✅ {state:20} | R²: {r2_test:6.2%} | MAE: ₹{mae_test/100:6.2f}/KG")
        
        except Exception as e:
            print(f"   ⚠️ {state:20} | Error: {str(e)[:50]}")
            continue

# ✅ FIX: Save the metadata map for instant app loading
with open("models/metadata.json", "w") as jf:
    json.dump(available_combos, jf)

print("\n" + "="*70)
print("✅ TRAINING COMPLETE!")
print("="*70)
print(f"\n📦 Saved {crop_count} individual models to `models/` directory")
print(f"\n🚀 App will now lazy-load individual models instantly!")
print("="*70 + "\n")
