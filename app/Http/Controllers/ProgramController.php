<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Program;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index()
    {
        $page_title = 'Program';
        $page_description = 'View programs';
        $programs = Program::all();

        return Inertia::render('program/index', [
            'programs' => $programs,
        ]);
    }

    public function create()
    {
        $page_title = 'Program Baru';
        $page_description = 'Input Data Program';
        $logo = "images/logo.png";
        $logoText = "images/logo-text.png";
        $action = __FUNCTION__;

        return Inertia::render('program/form');
    }

    public function edit($id)
    {
        $page_title = 'Sunting Program';
        $page_description = 'Sunting Data Program';
        $logo = "images/logo.png";
        $logoText = "images/logo-text.png";
        $action = __FUNCTION__;

        $program = Program::with('targets')->findOrFail($id);

        return Inertia::render('program/form', [
            'program' => $program
        ]);
    }
}
