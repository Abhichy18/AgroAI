import pandas as pd
import numpy as np
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from src.data_preprocessing import load_and_clean_data
from src.feature_engineering import create_features
from src.train_model import train_model
from src.config import DATASET_PATH

# Load data
df = load_and_clean_data(DATASET_PATH)

print("\n" + "="*60)
print("🌾 AgroAI Model Accuracy Report")
print("="*60)

# Get first crop-state combination for testing
crop = df['crop'].unique()[0]
state = df['state'].unique()[0]

df_crop = df[(df['crop'] == crop) & (df['state'] == state)]

print(f"\n✅ Testing with: {crop} in {state}")
print(f"📊 Total data points: {len(df_crop)}")

df_feat = create_features(df_crop)

features = ['day','month','day_of_week','lag1','lag2','lag3','roll3','roll7']

X = df_feat[features]
y = df_feat['price']

split = int(len(df_feat)*0.8)

X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

print(f"📚 Training set: {len(X_train)} samples")
print(f"🧪 Testing set: {len(X_test)} samples")

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
mape_test = np.mean(np.abs((y_test - y_pred_test) / y_test)) * 100

print("\n" + "="*60)
print("📈 MODEL PERFORMANCE METRICS")
print("="*60)

print(f"\n🎯 R² Score (Coefficient of Determination):")
print(f"   • Training: {r2_train:.4f} ({r2_train*100:.2f}%)")
print(f"   • Testing:  {r2_test:.4f} ({r2_test*100:.2f}%)")
print(f"   ➜ Model explains {r2_test*100:.2f}% of price variance")

print(f"\n📉 Mean Absolute Error (MAE):")
print(f"   • Testing: ₹{mae_test:.2f}/Quintal")
print(f"   ➜ Average prediction error ±₹{mae_test:.2f}")

print(f"\n🎲 Root Mean Squared Error (RMSE):")
print(f"   • Testing: ₹{rmse_test:.2f}/Quintal")
print(f"   ➜ Penalizes larger errors more heavily")

print(f"\n📊 Mean Absolute Percentage Error (MAPE):")
print(f"   • Testing: {mape_test:.2f}%")
print(f"   ➜ Average percentage error in predictions")

print(f"\n💹 Price Range:")
print(f"   • Actual prices: ₹{y_test.min():.2f} - ₹{y_test.max():.2f}")
print(f"   • Predictions:   ₹{y_pred_test.min():.2f} - ₹{y_pred_test.max():.2f}")

print("\n" + "="*60)
print("✨ CONCLUSION")
print("="*60)

if r2_test > 0.8:
    quality = "⭐⭐⭐⭐⭐ EXCELLENT (>80%)"
elif r2_test > 0.7:
    quality = "⭐⭐⭐⭐ VERY GOOD (70-80%)"
elif r2_test > 0.6:
    quality = "⭐⭐⭐ GOOD (60-70%)"
elif r2_test > 0.5:
    quality = "⭐⭐ FAIR (50-60%)"
else:
    quality = "⭐ NEEDS IMPROVEMENT (<50%)"

print(f"\nModel Quality: {quality}")
print(f"\n✅ The model is {('ready for production' if r2_test > 0.7 else 'under development')}")
print("="*60 + "\n")
