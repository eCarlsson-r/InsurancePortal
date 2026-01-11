<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index()
    {
        $page_title = 'Program';
        $page_description = 'View programs';
        $programs = Program::all();
        return view('program.index', compact('programs', 'page_title', 'page_description'));
    }
}
