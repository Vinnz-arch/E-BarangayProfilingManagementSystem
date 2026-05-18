<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'resident_id',
        'document_type',
        'purpose',
        'status',
        'tracking_number',
        'remarks',
    ];

    /**
     * Request Status Constants
     */
    const STATUS_PENDING = 'Pending';
    const STATUS_PROCESSING = 'Processing';
    const STATUS_READY = 'Ready for Pickup';
    const STATUS_CLAIMED = 'Claimed';
    const STATUS_REJECTED = 'Rejected';

    /**
     * Get the resident that owns the document request.
     */
    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }
}
