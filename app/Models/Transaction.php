<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'product_id', 'user_id', 'type', 
        'category', 'quantity', 'status'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approval(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Approval::class);
    }
}