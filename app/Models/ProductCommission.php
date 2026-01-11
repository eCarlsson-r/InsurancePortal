<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCommission extends Model
{
    protected $fillable = [
        'product_id',
        'payment_method',
        'currency',
        'year',
        'payment_period',
        'commission_rate',
        'extra_commission',
    ];

    protected $casts = [
        'commission_rate' => 'decimal:2',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
