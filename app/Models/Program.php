<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $table = 'programs';

    protected $fillable = [
        'name',
        'position',
        'min_allowance',
        'max_allowance',
        'duration',
        'direct_calculation',
        'indirect_calculation',
    ];

    protected $casts = [
        'min_allowance' => 'integer',
        'max_allowance' => 'integer',
        'duration' => 'integer',
        'direct_calculation' => 'integer',
        'indirect_calculation' => 'integer',
    ];

    public function targets()
    {
        return $this->hasMany(ProgramTarget::class);
    }

    public function agentPrograms()
    {
        return $this->hasMany(AgentProgram::class);
    }

    public function agents()
    {
        return $this->belongsToMany(Agent::class)
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
