<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contest extends Model
{
    use HasFactory;
    protected $table = 'contests';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'type',
        'start',
        'end',
        'product',
        'level',
        'minimum_commision',
        'minimum_premium',
        'minimum_policy',
        'bonus_percent',
        'bonus_amount',
        'reward',
    ];

    protected $casts = [
        'start' => 'date',
        'end' => 'date',
        'minimum_commision' => 'integer',
        'minimum_premium' => 'integer',
        'minimum_policy' => 'integer',
        'bonus_percent' => 'decimal:2',
        'bonus_amount' => 'integer',
    ];

    protected $guarded = ['id'];
}
