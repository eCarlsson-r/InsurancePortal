<?php

namespace App\Http\Controllers;

use App\Models\Agency;
use App\Models\Agent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgencyController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $agencies = Agency::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('agency', [
            'agencies' => $agencies,
            'agents' => Agent::all(),
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function store(Request $request) {
        $agencyData = $request->validate([
            'name' => 'required|string',
            'city' => 'required|string',
            'director' => 'required|string',
            'leader' => 'nullable|string'
        ]);

        Agency::create($agencyData);

        return redirect()->route('master.agency.index');
    }

    public function update(Request $request, Agency $agency) {
        $agencyData = $request->validate([
            'name' => 'required|string',
            'city' => 'required|string',
            'director' => 'required|string',
            'leader' => 'nullable|string'
        ]);

        $agency->update($agencyData);

        return redirect()->route('master.agency.index');
    }

    public function destroy(Agency $agency) {
        $agency->delete();
        return redirect()->back();
    }
}
