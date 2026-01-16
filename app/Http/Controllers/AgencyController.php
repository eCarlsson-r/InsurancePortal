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
}
