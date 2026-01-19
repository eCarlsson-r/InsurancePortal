<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Program;
use App\Models\ProgramTarget;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $programs = Program::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('program/index', [
            'programs' => $programs,
            'filters' => [
                'search' => $search
            ]
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

    public function store(Request $request)
    {
        $program = Program::create([
            'name' => $request->name,
            'position' => $request->position,
            'min_allowance' => $request->min_allowance,
            'max_allowance' => $request->max_allowance,
            'duration' => $request->duration,
            'direct_calculation' => $request->direct_calculation,
            'indirect_calculation' => $request->indirect_calculation
        ]);

        return Inertia::render('program/index', [
            'programs' => Program::all(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $program = Program::findOrFail($id);
        $program->update([
            'name' => $request->name,
            'position' => $request->position,
            'min_allowance' => $request->min_allowance,
            'max_allowance' => $request->max_allowance,
            'duration' => $request->duration,
            'direct_calculation' => $request->direct_calculation,
            'indirect_calculation' => $request->indirect_calculation
        ]);

        return Inertia::render('program/index', [
            'programs' => Program::all(),
        ]);
    }

    public function destroy(Program $program)
    {
        $program->delete();
        return redirect()->back();
    }

    public function remove_target($id)
    {
        $target = ProgramTarget::findOrFail($id);
        $target->delete();
        return redirect()->back();
    }
}
