<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contest extends Model
{
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
    ];

    protected $guarded = ['id'];
}
