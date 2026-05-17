<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Claim extends Model
{
    use HasFactory;

    protected $fillable = [
        'claim_number',
        'policy_id',
        'user_id',
        'claim_type',
        'claim_date',
        'incident_date',
        'claim_amount',
        'status',
        'description',
        'rejection_reason',
        'approved_at',
        'paid_at',
        'approved_amount',
    ];

    protected $guarded = ['id'];

    protected $casts = [
        'claim_date' => 'date',
        'incident_date' => 'date',
        'claim_amount' => 'integer',
        'approved_amount' => 'integer',
        'approved_at' => 'date',
        'paid_at' => 'date',
    ];

    /**
     * Get the policy that owns the claim.
     */
    public function policy(): BelongsTo
    {
        return $this->belongsTo(Policy::class, 'policy_id');
    }

    /**
     * Get the user that created the claim.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

// Made with Bob
