<?php

namespace App\Http\Controllers;

use App\Agency;
use Illuminate\Http\Request;

class AgencyController extends Controller
{
    public function index()
    {
        $page_title = 'Agency';
        $page_description = 'View agencies';
		$logo = "images/logo.png";
		$logoText = "images/logo-text.png";
		$agency = Agency::all();
		$action = __FUNCTION__;
        
        return view('pages.agency', compact('page_title', 'page_description','action','logo','logoText', 'agency'));
    }
}
