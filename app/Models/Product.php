<?php

namespace App\Models;
use App\Models\StockForecast;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'sku', 'name', 'stock', 
        'min_threshold', 'unit_price', 'status'
    ];

    // Relasi ke Kategori
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Relasi ke Riwayat Transaksi 
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    // Relasi ke Hasil Prediksi AI 
    public function forecasts(): HasMany
    {
        return $this->hasMany(StockForecast::class);
    }
}