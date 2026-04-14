def create_features(df):
    df = df.copy()

    df['day'] = df['date'].dt.day
    df['month'] = df['date'].dt.month
    df['day_of_week'] = df['date'].dt.dayofweek

    df['lag1'] = df['price'].shift(1)
    df['lag2'] = df['price'].shift(2)
    df['lag3'] = df['price'].shift(3)

    df['roll3'] = df['price'].rolling(3).mean()
    df['roll7'] = df['price'].rolling(7).mean()

    df = df.dropna()
    df = df[df['price'] < df['price'].quantile(0.99)]

    return df


