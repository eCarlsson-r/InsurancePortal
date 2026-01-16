<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $page_title = 'Customer';
        $page_description = 'View customers';
		$logo = "images/logo.png";
		$logoText = "images/logo-text.png";
		$action = __FUNCTION__;
        $customers = Customer::all();

        return Inertia::render('customer/index', [
            'customers' => Customer::all(),
        ]);
    }

    public function create()
    {
        $page_title = 'Customer';
        $page_description = 'Create customer';
		$logo = "images/logo.png";
		$logoText = "images/logo-text.png";
		$action = __FUNCTION__;
        return Inertia::render('customer/form');
    }

    public function edit(Customer $customer)
    {
        $page_title = 'Customer';
        $page_description = 'Edit customer';
		$logo = "images/logo.png";
		$logoText = "images/logo-text.png";
		$action = __FUNCTION__;
        return Inertia::render('customer/form', [
            'customer' => $customer,
        ]);
    }
}
