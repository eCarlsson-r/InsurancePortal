<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    protected $table = 'agent';
    protected $fillable = [
        'agent-code',
        'agent-number',
        'apply-date',
        'apply-place',
        'apply-agency',
        'agent-name',
        'agent-gender',
        'agent-birth-place',
        'agent-birth-date',
        'agent-address',
        'agent-religion',
        'agent-idno',
        'agent-taxno',
        'agent-city',
        'agent-province',
        'agent-postal',
        'agent-education',
        'agent-phone',
        'agent-mobile',
        'agent-email',
        'agent-status',
        'agent-spouse',
        'agent-occupation',
        'agent-dependents',
        'agent-license',
        'agent-duedate',
        'agent-recruiter',
        'agent-notes'
    ];

    protected $guarded = [
        'agent-code'
    ];
}
