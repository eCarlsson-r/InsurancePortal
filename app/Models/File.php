<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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

    protected $appends = ['path'];

    protected $casts = [
        'upload_date' => 'date',
    ];

    public function policy()
    {
        if ($this->purpose === 'case') {
            return $this->belongsTo(Policy::class, 'document_id', 'id');
        }
    }

    public function agent()
    {
        if ($this->purpose === 'agent') {
            return $this->belongsTo(Agent::class, 'document_id');
        }
    }

    public function getPathAttribute()
    {
        try {
            return Storage::disk('local')->url('documents/' . $this->name . '.' . $this->extension);
        } catch (\Exception $e) {
            return null;
        }
    }
}
