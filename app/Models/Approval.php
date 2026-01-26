<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Approval extends Model
{
    protected $fillable = [
        'transaction_id', 'product_id', 'requester_id', 
        'approver_id', 'status', 'notes'
    ];

    // Relasi ke Transaksi (Jika ini adalah pengajuan mutasi stok)
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    // Relasi ke Produk (Jika ini adalah pengajuan produk baru)
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // User yang membuat pengajuan (Staff/Admin)
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    // Superadmin yang memvalidasi
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }
}