import pandas as pd
import sys
import json
from sqlalchemy import create_engine
from statsmodels.tsa.holtwinters import SimpleExpSmoothing
from datetime import datetime, timedelta

def get_restock_prediction(product_id):
    try:
        engine = create_engine("postgresql://postgres:azariaputri181818@127.0.0.1:5432/smartstock_ai")
        
        # 1. Info Produk
        prod_query = f"SELECT name, stock, min_threshold FROM products WHERE id = {product_id}"
        prod_info = pd.read_sql(prod_query, engine).iloc[0]
        current_stock = int(prod_info['stock'])
        threshold = int(prod_info['min_threshold'])

        # 2. Riwayat Transaksi (60 hari agar tren lebih kelihatan)
        trans_query = f"SELECT created_at, type, quantity FROM transactions WHERE product_id = {product_id} AND status = 'approved'"
        df = pd.read_sql(trans_query, engine)

        if len(df) < 5:
            return {"error": "Insufficient data for neural analysis."}

        # 3. Hitung Statistik Tren (7 hari terakhir vs 7 hari sebelumnya)
        df['date'] = pd.to_datetime(df['created_at']).dt.date
        daily_out = df[df['type'] == 'OUT'].groupby('date')['quantity'].sum().reset_index()
        
        last_7_days = daily_out.iloc[-7:]['quantity'].sum() if len(daily_out) >= 7 else daily_out['quantity'].sum()
        prev_7_days = daily_out.iloc[-14:-7]['quantity'].sum() if len(daily_out) >= 14 else 0
        
        # Hitung persentase kenaikan/penurunan demand
        if prev_7_days > 0:
            change_pct = ((last_7_days - prev_7_days) / prev_7_days) * 100
            trend_msg = f"demand has {'increased' if change_pct > 0 else 'decreased'} by {abs(int(change_pct))}% this week"
        else:
            trend_msg = "demand patterns are stabilizing"

        # 4. AI Forecast (Simple Exponential Smoothing)
        model = SimpleExpSmoothing(daily_out['quantity'], initialization_method="estimated").fit()
        predicted_daily_out = model.forecast(1).iloc[0]
        if predicted_daily_out <= 0: predicted_daily_out = daily_out['quantity'].mean()

        # 5. Kalkulasi Sisa Hari
        gap = current_stock - threshold
        days_left = int(gap / predicted_daily_out) if predicted_daily_out > 0 else 99
        prediction_date = datetime.now() + timedelta(days=max(0, days_left))

        # 6. Susun Pesan Insightful
        insight = f"Based on recent flow, {trend_msg}. "
        if days_left <= 3:
            insight += f"CRITICAL: Stock will hit threshold in approx {days_left} days. Restock by {prediction_date.strftime('%d %b')}."
        else:
            insight += f"Current burn rate is {round(predicted_daily_out, 1)} units/day. Prediction: hits threshold on {prediction_date.strftime('%d %b')} ({days_left} days left)."

        return {
            "status": "SUCCESS",
            "days_left": days_left,
            "message": insight
        }
    except Exception as e:
        return {"error": str(e)}
    
    
if __name__ == "__main__":
    # Mengambil ID dari argument Laravel (sys.argv[1])
    p_id = sys.argv[1] if len(sys.argv) > 1 else 1
    result = get_restock_prediction(p_id)
    # Output sebagai JSON murni agar bisa dibaca Laravel
    print(json.dumps(result))