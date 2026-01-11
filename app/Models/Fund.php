<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fund extends Model
{
    protected $fillable = [
        'code',
        'name',
        'currency',
    ];

    public function investments()
    {
        return $this->hasMany(Investment::class);
    }
}
