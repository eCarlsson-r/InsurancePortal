<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Agency extends Model
{
    protected $table = "agency";
    protected $primaryKey = 'agency-code';
    public $timestamps = false;
    protected $keyType = 'string';
    protected $fillable = ['agency-name', 'agency-city', 'agency-director', 'agency-leader'];
    protected $guarded = ['agency-code'];
}
