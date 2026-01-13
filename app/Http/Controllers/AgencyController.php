<?php

namespace App\Http\Controllers;

use App\Agency;
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

        return Inertia::render('agency/index', [
            'agency' => Agency::all(),
        ]);
    }
}
