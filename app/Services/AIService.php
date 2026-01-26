<?php

namespace App\Services;

use App\Models\StockForecast;
use Illuminate\Support\Facades\Log;

class AIService
{
    public function syncForecast($productId)
    {
        try {
            $predictions = [
                ['date' => now()->addDays(1)->format('Y-m-d'), 'quantity' => 15],
                ['date' => now()->addDays(2)->format('Y-m-d'), 'quantity' => 18],
                ['date' => now()->addDays(3)->format('Y-m-d'), 'quantity' => 12],
            ];

            foreach ($predictions as $data) {
                // Gunakan class langsung agar tidak ada isu namespace
                StockForecast::updateOrCreate(
                    ['product_id' => $productId, 'forecast_date' => $data['date']],
                    ['predicted_quantity' => $data['quantity']]
                );
            }

            return "Sukses mengisi data untuk produk ID: " . $productId;
        } catch (\Exception $e) {
            return "Gagal: " . $e->getMessage();
        }
    }
}