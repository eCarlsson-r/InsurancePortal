<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Fund;

class FundController extends Controller
{
    public function index()
    {
        $page_title = 'Fund';
        $page_description = 'View funds';
        $funds = Fund::all();

        return Inertia::render('fund', [
            'funds' => $funds,
            'page_title' => $page_title,
            'page_description' => $page_description,
        ]);
    }
}
