<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Contest;

class ContestController extends Controller
{
    public function index()
    {
        $page_title = 'Contest';
        $page_description = 'View contests';
        $contests = Contest::all();

        return Inertia::render('contest', [
            'contests' => $contests,
        ]);
    }
}
