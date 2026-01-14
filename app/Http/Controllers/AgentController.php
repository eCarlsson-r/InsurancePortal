<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Program;
use App\Models\Agency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgentController extends Controller
{
    public function index()
    {
        $page_title = 'Agen';
        $page_description = 'Daftar Agen';
        $logo = "images/logo.png";
        $logoText = "images/logo-text.png";
        $action = __FUNCTION__;

        return Inertia::render('agent/index', [
            'agents' => Agent::with('programs')->get(),
        ]);
    }

    public function create()
    {
        $page_title = 'Agen Baru';
        $page_description = 'Input Data Agen';
        $logo = "images/logo.png";
        $logoText = "images/logo-text.png";
        $action = __FUNCTION__;

        return Inertia::render('agent/form', [
            'agents' => Agent::all(),
            'agencies' => Agency::all(),
            'programs' => Program::all()
        ]);
    }

    public function edit($id)
    {
        $page_title = 'Sunting Agen';
        $page_description = 'Sunting Data Agen';
        $logo = "images/logo.png";
        $logoText = "images/logo-text.png";
        $action = __FUNCTION__;

        $agent = Agent::findOrFail($id);

        return Inertia::render('agent/form', [
            'agent' => $agent,
            'agents' => Agent::all(),
            'agencies' => Agency::all(),
            'programs' => Program::all()
        ]);
    }
}
