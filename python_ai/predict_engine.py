import pandas as pd
import sys
import json
from sqlalchemy import create_engine
from statsmodels.tsa.holtwinters import SimpleExpSmoothing
from datetime import datetime, timedelta

def get_restock_prediction(product_id):
    try:
        # Koneksi Postgres
        engine = create_engine("postgresql://postgres:azariaputri181818@127.0.0.1:5432/smartstock_ai")
        
        # Ambil info produk
        prod_query = f"SELECT stock, min_threshold FROM products WHERE id = {product_id}"
        prod_info = pd.read_sql(prod_query, engine).iloc[0]
        current_stock = int(prod_info['stock'])
        threshold = int(prod_info['min_threshold'])

        # Ambil riwayat transaksi
        trans_query = f"SELECT created_at, type, quantity FROM transactions WHERE product_id = {product_id} AND status = 'approved'"
        df = pd.read_sql(trans_query, engine)

        if len(df) < 5:
            return {"error": "Insufficient data (min 5 approved transactions needed)"}

        # Analisis AI Burn Rate
        df['date'] = pd.to_datetime(df['created_at']).dt.date
        out_df = df[df['type'] == 'OUT'].groupby('date')['quantity'].sum().reset_index()
        
        if out_df.empty:
            return {"error": "No outgoing transactions found for analysis"}

        model = SimpleExpSmoothing(out_df['quantity'], initialization_method="estimated").fit()
        predicted_daily_out = model.forecast(1).iloc[0]
        
        if predicted_daily_out <= 0:
            predicted_daily_out = out_df['quantity'].mean()

        gap_to_threshold = current_stock - threshold
        
        if gap_to_threshold <= 0:
            return {
                "status": "CRITICAL",
                "message": "STOCK BELOW THRESHOLD! Restock immediately.",
                "days_left": 0
            }

        days_to_restock = gap_to_threshold / predicted_daily_out
        prediction_date = datetime.now() + timedelta(days=int(days_to_restock))

        return {
            "status": "HEALTHY",
            "current_stock": current_stock,
            "threshold": threshold,
            "burn_rate": float(round(predicted_daily_out, 2)),
            "days_left": int(days_to_restock),
            "predicted_date": prediction_date.strftime('%d %B %Y'),
            "message": f"Predicted restock date: {prediction_date.strftime('%d %B %Y')} ({int(days_to_restock)} days left)"
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Mengambil ID dari argument Laravel (sys.argv[1])
    p_id = sys.argv[1] if len(sys.argv) > 1 else 1
    result = get_restock_prediction(p_id)
    # Output sebagai JSON murni agar bisa dibaca Laravel
    print(json.dumps(result))