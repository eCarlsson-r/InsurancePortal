<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OllamaService;
use App\Services\PolicyExtractionService;
use App\Models\Policy;
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
            return $q->where('customer-name', 'like', "%{$query}%")
                     ->orWhere('policy-no', 'like', "%{$query}%")
                     ->orWhere('case-code', 'like', "%{$query}%");
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
        }

        return Inertia::render('policy/form', [
            'extracted' => $extracted
        ]);
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
        Cache::put("ocr_result_{$ocrId}", ['status' => 'processing'], now()->addMinutes(30));

        // 4. Dispatch the Job to the background
        // We pass the path and the ID so the Job knows what to do and where to save the result
        ProcessPolicyOCR::dispatch($fullPath, $ocrId);

        // 5. Return immediately to avoid the 504 Timeout
        return redirect()->back()->with('ocr_id', $ocrId);
    }
}
