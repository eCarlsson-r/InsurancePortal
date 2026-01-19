<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $table = 'files';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'type',
        'extension',
        'size',
        'upload_date',
        'purpose',
        'document_id',
    ];

    protected $casts = [
        'upload_date' => 'date',
    ];

    public function policy()
    {
        if ($this->purpose === 'case') {
            return $this->belongsTo(Policy::class, 'document_id', 'case_code');
        }
    }

    public function agent()
    {
        if ($this->purpose === 'agent') {
            return $this->belongsTo(Agent::class, 'document_id');
        }
    }
}
