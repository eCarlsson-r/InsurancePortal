<?php

namespace App\Http\Controllers;

use App\Models\Agency;
use App\Models\Agent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgencyController extends Controller
{
    public function index()
    {
        $page_title = 'Agency';
        $page_description = 'View agencies';
		$logo = "images/logo.png";
		$logoText = "images/logo-text.png";
		$action = __FUNCTION__;

        return Inertia::render('agency', [
            'agencies' => Agency::all(),
            'agents' => Agent::all()
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

        return redirect()->route('master.agency.index');
    }
}
