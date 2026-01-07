<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $table = 'files';
    protected $fillable = [
        'file-name',
        'file-type',
        'file-ext',
        'file-size',
        'file-upload-date',
        'file-purpose',
        'file-document-id',
    ];

    public function policy()
    {
        if ($this->file-purpose == 'case') {
            return $this->belongsTo(Policy::class, 'file-document-id', 'case-code');
        }
    }
}
