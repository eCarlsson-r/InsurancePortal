<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCredit extends Model
{
    protected $fillable = [
        'product_id',
        'production_credit',
        'contest_credit',
        'credit_start',
        'credit_end',
    ];

    protected $casts = [
        'credit_start' => 'date',
        'credit_end' => 'date',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
