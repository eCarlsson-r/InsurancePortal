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
        'identity',
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

    public function getAgeAttribute()
    {
        return $this->birth_date ? $this->birth_date->age : null;
    }

    public function getAddressAttribute()
    {
        return implode(', ', array_filter([
            $this->home_address,
            $this->home_city,
            $this->home_postal
        ]));
    }
}
