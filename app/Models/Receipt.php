<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    protected $table = 'receipts';
    protected $primaryKey = 'receipt_code';
    public $timestamps = false;

    protected $fillable = [
        'policy_code',
        'agent_id',
        'premium',
        'curr_rate',
        'pay_method',
        'pay_date',
        'paid_date',
        'paid_amount',
        'description',
    ];

    protected $casts = [
        'pay_date' => 'date',
        'paid_date' => 'date',
        'curr_rate' => 'decimal:4',
    ];

    protected $guarded = ['id'];

    public function policy()
    {
        return $this->belongsTo(Policy::class, 'policy_code', 'case_code');
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }
}
