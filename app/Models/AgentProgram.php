<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class AgentProgram extends Pivot
{
    protected $table = 'agent_programs';
    protected $primaryKey = 'id';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'agent_id',
        'program_id',
        'position',
        'program_start',
        'program_end',
        'agent_leader_id',
        'allowance',
    ];

    protected $casts = [
        'agent_id' => 'integer',
        'program_id' => 'integer',
        'program_start' => 'date',
        'program_end' => 'date',
        'agent_leader_id' => 'integer',
        'allowance' => 'integer',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function leader()
    {
        return $this->belongsTo(Agent::class, 'agent_leader_id');
    }
}
