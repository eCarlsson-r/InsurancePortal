<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rider extends Model
{
    protected $fillable = [
        'case_id',
        'product_id',
        'insure_amount',
        'premium',
        'insure_period',
        'pay_period',
        'add_date',
    ];

    protected $casts = [
        'add_date' => 'date',
    ];

    public function policy()
    {
        return $this->belongsTo(Policy::class, 'case_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
