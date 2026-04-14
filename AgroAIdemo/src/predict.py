import pandas as pd

def predict_future(model, df):
    temp = df.copy()
    last_row = temp.iloc[-1]

    future_preds = []

    for i in range(7):
        new_row = {}

        new_row['day'] = (last_row['day'] + i) % 30 + 1
        new_row['month'] = last_row['month']
        new_row['day_of_week'] = (last_row['day_of_week'] + i) % 7

        new_row['lag1'] = temp.iloc[-1]['price']
        new_row['lag2'] = temp.iloc[-2]['price']
        new_row['lag3'] = temp.iloc[-3]['price']

        new_row['roll3'] = temp['price'].tail(3).mean()
        new_row['roll7'] = temp['price'].tail(7).mean()

        pred = model.predict(pd.DataFrame([new_row]))[0]
        future_preds.append(pred)

        new_entry = last_row.copy()
        new_entry['price'] = pred
        temp = pd.concat([temp, pd.DataFrame([new_entry])], ignore_index=True)

    return future_preds
