import pandas as pd

def load_and_clean_data(path):
    df = pd.read_csv(path)

    df.rename(columns={
        "Market Name": "mandi",
        "Commodity": "crop",
        "Modal Price (Rs./Quintal)": "price",
        "Min Price (Rs./Quintal)": "min_price",
        "Max Price (Rs./Quintal)": "max_price",
        "Price Date": "date",
        "State": "state"
    }, inplace=True)

    df['date'] = pd.to_datetime(df['date'], dayfirst=True, errors='coerce')
    df['price'] = pd.to_numeric(df['price'], errors='coerce')
    df['min_price'] = pd.to_numeric(df['min_price'], errors='coerce')
    df['max_price'] = pd.to_numeric(df['max_price'], errors='coerce')

    # Keep only rows with required values for training/inference.
    df = df.dropna(subset=['date', 'crop', 'state', 'mandi', 'price'])
    df = df.sort_values('date')

    return df
