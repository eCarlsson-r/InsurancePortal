<?php

namespace App\Http\Controllers;

use App\Agent;
use App\Agency;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    public function index()
    {
        $page_title = 'Agen';
        $page_description = 'Daftar Agen';
        $logo = "images/logo.png";
        $logoText = "images/logo-text.png";
        $action = __FUNCTION__;
        
        return Inertia::render('agent');
    }

    public function create()
    {
        $page_title = 'Agen Baru';
        $page_description = 'Input Data Agen';
        $logo = "images/logo.png";
        $logoText = "images/logo-text.png";
        $action = __FUNCTION__;
        
        return Inertia::render('agent/form');
    }

    public function edit($id)
    {
        $page_title = 'Sunting Agen';
        $page_description = 'Sunting Data Agen';
        $logo = "images/logo.png";
        $logoText = "images/logo-text.png";
        $action = __FUNCTION__;
        
        // $agent = Agent::findOrFail($id);
        
        return Inertia::render('agent/form');
    }
}
