"""Project-wide configuration constants."""

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]

DATASET_PATH = (
    BASE_DIR
    / "agmarknet-india-commodity-prices-2024-2025"
    / "agmarknet_india_historical_prices_2024_2025.csv"
)
