<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = 'customers';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'gender',
        'identity_number',
        'mobile',
        'email',
        'birth_date',
        'birth_place',
        'religion',
        'marital',
        'profession',
        'home_address',
        'home_postal',
        'home_city',
        'work_address',
        'work_postal',
        'work_city',
        'description',
    ];

    protected $guarded = ['id'];

    protected $casts = [
        'birth_date' => 'date',
    ];
}
