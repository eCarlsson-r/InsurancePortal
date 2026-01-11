<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    protected $table = 'agents';
    public $timestamps = false;
    protected $fillable = [
        'official_number',
        'apply_date',
        'apply_place',
        'agency_id',
        'name',
        'gender',
        'birth_place',
        'birth_date',
        'address',
        'religion',
        'identity_number',
        'tax_number',
        'city',
        'province',
        'postal_code',
        'education',
        'phone',
        'mobile',
        'email',
        'status',
        'spouse',
        'occupation',
        'dependents',
        'license',
        'due_date',
        'recruiter_id',
        'notes',
    ];

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'apply_date' => 'date',
        'birth_date' => 'date',
        'due_date' => 'date',
    ];

    public function agentPrograms()
    {
        return $this->hasMany(AgentProgram::class);
    }

    public function programs()
    {
        return $this->belongsToMany(Program::class)
            ->using(AgentProgram::class)
            ->withPivot([
                'position',
                'program_start',
                'program_end',
                'agent_leader_id',
                'allowance',
            ])
            ->withTimestamps();
    }
}
