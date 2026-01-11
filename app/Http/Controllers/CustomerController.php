<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        $page_title = 'Customer';
        $page_description = 'View customers';
        $customers = Customer::all();
        return view('customer.index', compact('customers', 'page_title', 'page_description'));
    }
}
