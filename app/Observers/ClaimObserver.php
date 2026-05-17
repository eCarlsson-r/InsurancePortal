<?php

namespace App\Observers;

use App\Models\Claim;
use Illuminate\Support\Facades\DB;

class ClaimObserver
{
    /**
     * Handle the Claim "creating" event.
     * Auto-generate claim_number before creating a new claim.
     */
    public function creating(Claim $claim): void
    {
        if (empty($claim->claim_number)) {
            $claim->claim_number = $this->generateClaimNumber();
        }
    }

    /**
     * Generate a unique claim number.
     * Format: CLM-YYYYMMDD-XXXX (e.g., CLM-20260517-0001)
     */
    private function generateClaimNumber(): string
    {
        $date = now()->format('Ymd');
        $prefix = "CLM-{$date}-";

        // Get the last claim number for today
        $lastClaim = Claim::where('claim_number', 'like', $prefix . '%')
            ->orderBy('claim_number', 'desc')
            ->lockForUpdate()
            ->first();

        if ($lastClaim) {
            // Extract the sequence number and increment it
            $lastSequence = (int) substr($lastClaim->claim_number, -4);
            $newSequence = $lastSequence + 1;
        } else {
            // First claim of the day
            $newSequence = 1;
        }

        // Format with leading zeros (4 digits)
        return $prefix . str_pad($newSequence, 4, '0', STR_PAD_LEFT);
    }
}

// Made with Bob
