<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Receipt;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Agent;
use Inertia\Inertia;

class ReceiptController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $receipts = Receipt::query()->with('policy')
            ->when($search, function ($query, $search) {
                $query->whereHas('policy', function ($query) use ($search) {
                    $query->where('policy_no', 'like', "%{$search}%");
                });
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('receipt', [
            'receipts' => $receipts,
            'customers' => Customer::all(),
            'products' => Product::all(),
            'agents' => Agent::all(),
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function store(Request $request)
    {
        $receiptData = $request->validate([
            'case_id' => 'required|string',
            'agent_id' => 'required|string',
            'premium' => 'required|numeric',
            'currency_rate' => 'required|numeric',
            'pay_method' => 'required|string',
            'pay_date' => 'required|date',
            'paid_date' => 'required|date',
            'paid_amount' => 'required|numeric',
            'description' => 'required|string',
        ]);

        Receipt::create($receiptData);

        return redirect()->route('master.receipt.index');
    }

    public function update(Request $request, Receipt $receipt)
    {
        $receiptData = $request->validate([
            'case_id' => 'required|string',
            'agent_id' => 'required|string',
            'premium' => 'required|numeric',
            'currency_rate' => 'required|numeric',
            'pay_method' => 'required|string',
            'pay_date' => 'required|date',
            'paid_date' => 'required|date',
            'paid_amount' => 'required|numeric',
            'description' => 'required|string',
        ]);

        $receipt->update($receiptData);

        return redirect()->route('master.receipt.index');
    }

    public function destroy(Receipt $receipt) {
        $receipt->delete();
        return redirect()->back();
    }
}
