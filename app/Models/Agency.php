<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agency extends Model
{
    protected $table = "agencies";
    public $timestamps = false;
    protected $fillable = ['name', 'city', 'director', 'leader'];
    protected $guarded = ['id'];
}
