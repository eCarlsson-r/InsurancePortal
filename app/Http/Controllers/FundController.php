<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Fund;

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
}
