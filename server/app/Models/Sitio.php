<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sitio extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'address',
        'logo',
    ];
}
