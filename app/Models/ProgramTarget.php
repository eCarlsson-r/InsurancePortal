<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramTarget extends Model
{
    protected $table = 'program_targets';

    protected $fillable = [
        'program_id',
        'allowance',
        'month',
        'case_month',
        'fyp_month',
    ];

    protected $casts = [
        'program_id' => 'integer',
        'allowance' => 'integer',
        'month' => 'integer',
        'case_month' => 'integer',
        'fyp_month' => 'integer',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}
