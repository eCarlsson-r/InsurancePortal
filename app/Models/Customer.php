<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Customer extends Model
{
    use HasFactory;
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
        'gender' => 'integer',
        'religion' => 'integer',
        'marital' => 'integer'
    ];

    public function getAgeAttribute()
    {
        $dateOfBirth = $this->attributes['birth_date'];

        if ($dateOfBirth) {
            return Carbon::parse($dateOfBirth)->age;
        }

        return null;
    }

    public function getAddressAttribute()
    {
        return implode(', ', array_filter([
            $this->home_address,
            $this->home_city,
            $this->home_postal
        ]));
    }

    /**
     * Get policies where this customer is the holder
     */
    public function policiesAsHolder()
    {
        return $this->hasMany(Policy::class, 'holder_id');
    }

    /**
     * Get policies where this customer is the insured
     */
    public function policiesAsInsured()
    {
        return $this->hasMany(Policy::class, 'insured_id');
    }
}
