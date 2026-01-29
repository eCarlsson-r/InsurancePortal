<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'type',
    ];

    public function commissions()
    {
        return $this->hasMany(ProductCommission::class);
    }

    public function credits()
    {
        return $this->hasMany(ProductCredit::class);
    }

    public function policies()
    {
        return $this->hasMany(Policy::class, 'product_id');
    }
}
