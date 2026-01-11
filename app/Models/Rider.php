<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rider extends Model
{
    protected $fillable = [
        'case_id',
        'product_id',
        'rider_insure',
        'rider_premium',
        'rider_insure_period',
        'rider_pay_period',
        'rider_add_date',
    ];

    protected $casts = [
        'rider_add_date' => 'date',
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
