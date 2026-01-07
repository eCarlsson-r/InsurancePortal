<?php

namespace App\Models;

use App\Models\File;

use Illuminate\Database\Eloquent\Model;

class Policy extends Model
{
    protected $table = "case";
    protected $primaryKey = 'case-code';
    public $timestamps = false;
    protected $keyType = 'string';
    protected $fillable = [
        'policy-no', 
        'case-agent',
        'case-customer', 
        'case-insured', 
        'hubungan',
        'case-tagih', 
        'insured-name',
        'insured-birthplace',
        'insured-birthdate',
        'insured-gender',
        'insured-marital',
        'insured-profession',
        'insure-holder',
        'insured-homeaddress',
        'insured-homepostal',
        'insured-homecity',
        'insured-workaddress',
        'insured-workpostal',
        'insured-workcity',
        'case-entry-date',
        'case-product',
        'case-insure-period',
        'case-pay-period',
        'case-currency',
        'case-curr-rate',
        'case-start-date',
        'case-base-insure',
        'case-premium',
        'case-pay-method',
        'case-description',
        'case-subagent'
    ];
    protected $guarded = ['case-code'];

    public function files()
    {
        return $this->hasMany(File::class, 'file-document-id', 'case-code');
    }
}
