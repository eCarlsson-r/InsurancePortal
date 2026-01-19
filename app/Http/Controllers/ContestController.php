<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Contest;

class ContestController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $contests = Contest::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('contest', [
            'contests' => $contests,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function store(Request $request)
    {
        $contestData = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'start' => 'required|date',
            'end' => 'required|date',
            'product' => 'required|string',
            'level' => 'required|string',
            'minimum_commision' => 'required|numeric',
            'minimum_premium' => 'required|numeric',
            'minimum_policy' => 'required|numeric',
            'bonus_percent' => 'required|numeric',
            'bonus_amount' => 'required|numeric',
            'reward' => 'required|string',
        ]);

        Contest::create($contestData);

        return redirect()->route('master.contest.index');
    }

    public function update(Request $request, Contest $contest)
    {
        $contestData = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'start' => 'required|date',
            'end' => 'required|date',
            'product' => 'required|string',
            'level' => 'required|string',
            'minimum_commision' => 'required|numeric',
            'minimum_premium' => 'required|numeric',
            'minimum_policy' => 'required|numeric',
            'bonus_percent' => 'required|numeric',
            'bonus_amount' => 'required|numeric',
            'reward' => 'required|string',
        ]);

        $contest->update($contestData);

        return redirect()->route('master.contest.index');
    }

    public function destroy(Contest $contest)
    {
        $contest->delete();
        return redirect()->back();
    }
}
