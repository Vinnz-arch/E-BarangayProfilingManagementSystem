<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BeneficiaryDistribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'target_group',
        'distribution_date',
        'location',
        'status',
        'author_id',
    ];

    /**
     * Get the user who created the distribution.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
