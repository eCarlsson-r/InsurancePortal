<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $table = 'files';
    protected $primaryKey = 'file_id';
    public $timestamps = false;

    protected $fillable = [
        'file_name',
        'file_type',
        'file_ext',
        'file_size',
        'file_upload_date',
        'file_purpose',
        'file_document_id',
    ];

    protected $casts = [
        'file_upload_date' => 'date',
    ];

    public function policy()
    {
        if ($this->file_purpose === 'case') {
            return $this->belongsTo(Policy::class, 'file_document_id', 'case_code');
        }
    }
}
