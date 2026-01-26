<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockForecast extends Model
{
    // Daftarkan kolom agar bisa diisi oleh AIService
    protected $fillable = [
        'product_id',
        'forecast_date',
        'predicted_quantity',
        'accuracy_rate'
    ];
}