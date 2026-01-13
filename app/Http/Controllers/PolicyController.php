<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OllamaService;
use App\Services\PolicyExtractionService;
use App\Models\Policy;
use App\Models\Customer;
use App\Exceptions\PdfLockedException;
use App\Jobs\ProcessPolicyOCR;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Exception;
use Illuminate\Support\Facades\Storage;

class PolicyController extends Controller
{
    public function index(Request $request)
    {
        $page_title = 'Policy';
        $page_description = 'View policies';
		$logo = "images/logo.png";
		$logoText = "images/logo-text.png";

        $query = $request->get('q');
		$policies = Policy::when($query, function ($q) use ($query) {
            return $q->where('holder.name', 'like', "%{$query}%")
                    ->where('insured.name', 'like', "%{$query}%")
                    ->orWhere('policy_no', 'like', "%{$query}%")
                    ->orWhere('id', 'like', "%{$query}%");
        })->get();

        return Inertia::render('policy/index', [
            'policies' => $policies->toArray(),
            'query' => $request->input('q', '')
        ]);
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
                'fileUrl' => route('ocr.view-file', ['ocrId' => $request->ocr_id])
            ]);
        } else {
            return Inertia::render('policy/form');
        }
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'is_insure_holder' => 'required|boolean',
            'customer.name' => 'required|string',
            // Insured is only required if is_insure_holder is false
            'insured.name' => 'required_if:is_insure_holder,false|nullable|string',
        ]);

        $holder_id = Customer::updateOrCreate($validated['customer'])->id;

        if ($request->is_insure_holder) {
            // Logic to point insured_id to the same customer record
            $insured_id = $holder_id;
        } else {
            // Logic to create a separate insured record
            $insured_id = Customer::updateOrCreate($validated['insured'])->id;
        }

        $policy = Policy::create([
            'id' => $request->id,
            'policy_no' => $request->policy_no,
            'customer_id' => $holder_id,
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

        return Redirect::route('policy.index')->with('message', 'Data Berhasil Disimpan!');
    }

    public function edit($id)
    {
        $page_title = 'Sunting SP / Polis';
        $page_description = 'Sunting Data SP / Polis';
		$logo = "images/logo.png";
		$logoText = "images/logo-text.png";
		$action = __FUNCTION__;

        $policy = Policy::findOrFail($id);

        return Inertia::render('policy/form', [
            'policy' => $policy
        ]);
    }

    public function cancel($id) {
        $policy = Policy::findOrFail($id);
        $policy->update([
            'status' => 'cancelled',
        ]);
        return redirect()->route('policy.index')->with('success', 'Policy cancelled successfully');
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
}
