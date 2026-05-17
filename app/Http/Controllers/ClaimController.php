<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Claim;
use App\Models\Policy;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ClaimController extends Controller
{
    /**
     * Display a listing of claims with search filters.
     */
    public function index(Request $request)
    {
        $query = $request->get('q');
        $status = $request->get('status');
        $claimType = $request->get('claim_type');

        $claims = Claim::with(['policy.holder', 'policy.insured', 'user'])
            ->when($query, function ($q) use ($query) {
                return $q->where('claim_number', 'like', "%{$query}%")
                    ->orWhereHas('policy', function ($q) use ($query) {
                        $q->where('policy_no', 'like', "%{$query}%")
                            ->orWhere('case_code', 'like', "%{$query}%");
                    })
                    ->orWhereHas('policy.holder', function ($q) use ($query) {
                        $q->where('name', 'like', "%{$query}%");
                    })
                    ->orWhereHas('policy.insured', function ($q) use ($query) {
                        $q->where('name', 'like', "%{$query}%");
                    });
            })
            ->when($status, function ($q) use ($status) {
                return $q->where('status', $status);
            })
            ->when($claimType, function ($q) use ($claimType) {
                return $q->where('claim_type', $claimType);
            })
            ->orderBy('id', 'DESC')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('claim/index', [
            'claims' => $claims,
            'filters' => [
                'q' => $query,
                'status' => $status,
                'claim_type' => $claimType
            ]
        ]);
    }

    /**
     * Store a newly created claim in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'claim_number' => 'required|string|max:50|unique:claims,claim_number',
            'policy_id' => 'required|exists:cases,id',
            'user_id' => 'required|exists:users,id',
            'claim_type' => 'required|string|max:50',
            'claim_date' => 'required|date',
            'incident_date' => 'nullable|date',
            'claim_amount' => 'required|numeric|min:0',
            'status' => 'nullable|string|max:20|in:pending,approved,rejected,paid',
            'description' => 'nullable|string',
            'rejection_reason' => 'nullable|string',
            'approved_at' => 'nullable|date',
            'paid_at' => 'nullable|date',
            'approved_amount' => 'nullable|numeric|min:0',
        ]);

        // Set default status if not provided
        if (!isset($validated['status'])) {
            $validated['status'] = 'pending';
        }

        $claim = Claim::create($validated);

        return Redirect::route('sales.claim.index')->with('message', 'Klaim Berhasil Disimpan!');
    }

    /**
     * Display the specified claim.
     */
    public function show($id)
    {
        $claim = Claim::with([
            'policy.holder',
            'policy.insured',
            'policy.agent',
            'policy.product',
            'policy.files',
            'user'
        ])->findOrFail($id);

        return Inertia::render('claim/show', [
            'claim' => $claim
        ]);
    }

    /**
     * Approve a claim.
     */
    public function approve(Request $request, $id)
    {
        $claim = Claim::findOrFail($id);

        // Check if claim is pending
        if ($claim->status !== 'pending') {
            return Redirect::back()->with('error', 'Only pending claims can be approved.');
        }

        $validated = $request->validate([
            'approved_amount' => 'required|numeric|min:0|max:' . $claim->claim_amount,
        ]);

        $claim->update([
            'status' => 'approved',
            'approved_amount' => $validated['approved_amount'],
            'approved_at' => now(),
        ]);

        return Redirect::route('sales.claim.show', $claim->id)
            ->with('message', 'Claim approved successfully!');
    }

    /**
     * Reject a claim.
     */
    public function reject(Request $request, $id)
    {
        $claim = Claim::findOrFail($id);

        // Check if claim is pending
        if ($claim->status !== 'pending') {
            return Redirect::back()->with('error', 'Only pending claims can be rejected.');
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|min:10',
        ]);

        $claim->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return Redirect::route('sales.claim.show', $claim->id)
            ->with('message', 'Claim rejected.');
    }

    /**
     * Mark a claim as paid.
     */
    public function markPaid($id)
    {
        $claim = Claim::findOrFail($id);

        // Check if claim is approved
        if ($claim->status !== 'approved') {
            return Redirect::back()->with('error', 'Only approved claims can be marked as paid.');
        }

        $claim->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        return Redirect::route('sales.claim.show', $claim->id)
            ->with('message', 'Claim marked as paid successfully!');
    }
}

// Made with Bob
