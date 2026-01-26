<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $table = 'product_stocks'; 

    protected $fillable = ['product_id', 'quantity', 'type', 'category'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}