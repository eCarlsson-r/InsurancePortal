<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    use HasFactory;
    protected $fillable = [
        'case_id',
        'fund_id',
        'allocation',
    ];

    public function policy()
    {
        return $this->belongsTo(Policy::class, 'case_id');
    }

    public function fund()
    {
        return $this->belongsTo(Fund::class, 'fund_id');
    }
}
