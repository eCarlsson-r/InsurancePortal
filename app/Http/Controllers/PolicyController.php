<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OllamaService;
use App\Services\PolicyExtractionService;
use App\Models\Policy;
use App\Models\Agent;
use App\Models\Product;
use App\Models\Fund;
use App\Models\Customer;
use App\Exceptions\PdfLockedException;
use App\Jobs\ProcessPolicyOCR;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;

class PolicyController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->get('q');
        $policies = Policy::with(['holder', 'insured', 'product', 'agent'])
            ->when($query, function ($q) use ($query) {
                return $q->where('policy_no', 'like', "%{$query}%")
                    ->orWhere('id', 'like', "%{$query}%")
                    ->orWhereHas('holder', function ($q) use ($query) {
                        $q->where('name', 'like', "%{$query}%");
                    })
                    ->orWhereHas('insured', function ($q) use ($query) {
                        $q->where('name', 'like', "%{$query}%");
                    });
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('policy/index', [
            'policies' => $policies,
            'filters' => [
                'q' => $query
            ]
        ]);
    }

    public function store(Request $request) 
    {
        $holder_id = Customer::updateOrCreate($request->holder)->id;

        if ($request->is_insure_holder) {
            $insured_id = $holder_id;
        } else {
            $insured_id = Customer::updateOrCreate($request->insured)->id;
        }

        $policy = Policy::create([
            'policy_no' => $request->policy_no,
            'holder_id' => $holder_id,
            'insured_id' => $insured_id,
            'agent_id' => $request->agent_id,
            'holder_insured_relationship' => $request->holder_insured_relationship,
            'entry_date' => $request->entry_date,
            'bill_at' => $request->bill_at,
            'is_insure_holder' => $request->is_insure_holder,
            'product_id' => $request->product_id,
            'insure_period' => $request->insure_period,
            'pay_period' => $request->pay_period,
            'currency_id' => $request->currency_id,
            'curr_rate' => $request->curr_rate,
            'start_date' => $request->start_date,
            'base_insure' => $request->base_insure,
            'premium' => $request->premium,
            'pay_method' => $request->pay_method,
            'description' => $request->description
        ]);

        if ($request->investments) $policy->investments()->createMany($request->investments);
        if ($request->riders) $policy->riders()->createMany($request->riders);

        return Redirect::route('sales.policy.index')->with('message', 'Data Berhasil Disimpan!');
    }

    public function create(Request $request)
    {
        $page_title = 'SP / Polis Baru';
        $page_description = 'Input Data SP / Polis';
        $logo = "images/logo.png";
        $logoText = "images/logo-text.png";
        $action = __FUNCTION__;

        // Retrieve OCR data if the ocr_id exists in the URL
        $extracted = null;
        if ($request->has('ocr_id')) {
            $extracted = Cache::get("ocr_result_" . $request->ocr_id);

            return Inertia::render('policy/form', [
                'extracted' => $extracted['data'],
                'fileUrl' => route('ocr.view-file', ['ocrId' => $request->ocr_id]),
                'agents' => Agent::all(), 
                'products' => Product::all(),
                'funds' => Fund::all()
            ]);
        } else {
            return Inertia::render('policy/form', [
                'agents' => Agent::all(), 
                'products' => Product::all(),
                'funds' => Fund::all()
            ]);
        }
    }

    public function update(Request $request, $id) {
        $policy = Policy::findOrFail($id);

        $policy->update([
            'agent_id' => $request->agent_id,
            'holder_insured_relationship' => $request->holder_insured_relationship,
            'entry_date' => $request->entry_date,
            'bill_at' => $request->bill_at,
            'is_insure_holder' => $request->is_insure_holder,
            'product_id' => $request->product_id,
            'insure_period' => $request->insure_period,
            'pay_period' => $request->pay_period,
            'currency_id' => $request->currency_id,
            'curr_rate' => $request->curr_rate,
            'start_date' => $request->start_date,
            'base_insure' => $request->base_insure,
            'premium' => $request->premium,
            'pay_method' => $request->pay_method,
            'description' => $request->description
        ]);

        // Simple update: delete and recreate associated records
        $policy->investments()->delete();
        if ($request->investments) $policy->investments()->createMany($request->investments);
        
        $policy->riders()->delete();
        if ($request->riders) $policy->riders()->createMany($request->riders);

        return Redirect::route('sales.policy.index')->with('message', 'Data Berhasil Diperbarui!');
    }

    public function edit($id)
    {
        $page_title = 'Sunting SP / Polis';
        $page_description = 'Sunting Data SP / Polis';
		$logo = "images/logo.png";
		$logoText = "images/logo-text.png";
		$action = __FUNCTION__;

        $policy = Policy::with('holder', 'insured', 'agent', 'product', 'investments', 'riders')->findOrFail($id);

        return Inertia::render('policy/form', [
            'policy' => $policy,
            'agents' => Agent::all(), 
            'products' => Product::all(),
            'funds' => Fund::all()
        ]);
    }

    public function cancel($id) {
        $policy = Policy::findOrFail($id);
        $policy->update([
            'status' => 'cancelled',
        ]);
        return redirect()->route('sales.policy.index')->with('success', 'Policy cancelled successfully');
    }

    public function processOcr(Request $request)
    {
        $request->validate([
            'document' => 'required|mimes:pdf,jpg,png|max:10240',
            'password' => 'nullable|string'
        ]);

        // 1. Store the file
        $path = $request->file('document')->store('temp/ocr', 'local');
        $fullPath = Storage::disk('local')->path($path);

        // 2. Create a Unique ID for this task
        $ocrId = Str::uuid()->toString();

        // 3. Set an initial 'processing' status in the cache
        Cache::put("ocr_result_{$ocrId}", [
            'status' => 'processing',
            'file_path' => $path, // Store the relative path
            'file_name' => $request->file('document')->getClientOriginalName(),
            'data' => []
        ], now()->addMinutes(30));

        // 4. Dispatch the Job to the background
        // We pass the path and the ID so the Job knows what to do and where to save the result
        ProcessPolicyOCR::dispatch($fullPath, $ocrId);

        // 5. Return immediately to avoid the 504 Timeout
        return redirect()->back()->with('ocr_id', $ocrId);
    }

    public function remove_investment($id)
    {
        $investment = Investment::findOrFail($id);
        $investment->delete();
        return redirect()->back();
    }

    public function remove_rider($id)
    {
        $rider = Rider::findOrFail($id);
        $rider->delete();
        return redirect()->back();
    }
}
