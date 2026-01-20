<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    protected $table = 'receipts';
    public $timestamps = false;

    protected $fillable = [
        'case_id',
        'agent_id',
        'premium',
        'currency_rate',
        'pay_method',
        'pay_date',
        'paid_date',
        'paid_amount',
        'description',
    ];

    protected $casts = [
        'pay_date' => 'date',
        'paid_date' => 'date',
        'currency_rate' => 'decimal:4',
    ];

    protected $guarded = ['id'];

    public function policy()
    {
        return $this->belongsTo(Policy::class, 'case_id', 'id');
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }
}
