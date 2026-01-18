<?php

namespace App\Models;

use App\Models\Customer;
use App\Models\Agent;
use App\Models\File;
use Illuminate\Database\Eloquent\Model;

class Policy extends Model
{
    protected $table = 'cases';
    public $timestamps = false;

    protected $fillable = [
        'policy_no',
        'holder_id',
        'insured_id',
        'agent_id',
        'holder_insured_relationship',
        'entry_date',
        'bill_at',
        'is_insure_holder',
        'product_id',
        'insure_period',
        'pay_period',
        'currency_id',
        'curr_rate',
        'start_date',
        'base_insure',
        'premium',
        'pay_method',
        'description'
    ];

    protected $guarded = ['id'];

    protected $casts = [
        'entry_date' => 'date',
        'start_date' => 'date',
        'is_insure_holder' => 'boolean',
        'curr_rate' => 'decimal:4',
    ];

    public function files()
    {
        return $this->hasMany(File::class, 'file_document_id', 'case_code');
    }

    public function holder()
    {
        return $this->belongsTo(Customer::class, 'holder_id');
    }

    public function insured()
    {
        return $this->belongsTo(Customer::class, 'insured_id');
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function riders()
    {
        return $this->hasMany(Rider::class, 'case_id');
    }

    public function investments()
    {
        return $this->hasMany(Investment::class, 'case_id');
    }
}
