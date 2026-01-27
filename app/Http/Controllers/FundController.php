<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Fund;
use App\Models\File;
use Illuminate\Support\Facades\Storage;

class FundController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $funds = Fund::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('fund', [
            'funds' => $funds,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function store(Request $request)
    {
        $fundData = $request->validate([
            'name' => 'required|string',
            'currency' => 'required|numeric',
        ]);

        Fund::create($fundData);

        return redirect()->route('master.fund.index');
    }

    public function update(Request $request, Fund $fund)
    {
        $fundData = $request->validate([
            'name' => 'required|string',
            'currency' => 'required|numeric',
        ]);

        $fund->update($fundData);

        return redirect()->route('master.fund.index');
    }

    public function destroy(Fund $fund) {
        $fund->delete();
        return redirect()->back();
    }

    public function upload(Request $request)
    {
        $file = $request->file('document');
        $purpose = $request->purpose;
        $documentId = $request->document_id;
        
        if (!$file) {
            return response()->json([
                'message' => 'File is required',
            ], 400);
        }

        $path = $file->storeAs('documents', $file->getClientOriginalName());
        $fullPath = Storage::disk('local')->path($path);

        File::create([
            'name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'type' => $file->getMimeType(),
            'extension' => $file->getClientOriginalExtension(),
            'size' => $file->getSize(),
            'upload_date' => now(),
            'purpose' => $purpose,
            'document_id' => $documentId
        ]);        

        return redirect()->back();
    }

    public function viewFile($id)
    {
        $file = File::findOrFail($id);
        return Storage::disk('local')->response('documents/' . $file->name . '.' . $file->extension);
    }
}
