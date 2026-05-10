<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resident extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'sitio_id',
        'last_name',
        'first_name',
        'middle_name',
        'is_household_type',
        'gender',
        'date_of_birth',
        'citizenship',
        'civil_status',
        'occupation',
        'school_attainment',
        'skills',
        'blood_type',
        'is_4ps',
        'is_pwd',
        'is_solo_parent',
        'is_senior_citizen',
    ];

    protected $casts = [
        'is_4ps' => 'boolean',
        'is_pwd' => 'boolean',
        'is_solo_parent' => 'boolean',
        'is_senior_citizen' => 'boolean',
        'date_of_birth' => 'date',
    ];

    public function sitio(): BelongsTo
    {
        return $this->belongsTo(Sitio::class);
    }
}
