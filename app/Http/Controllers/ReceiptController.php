<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Receipt;
use Inertia\Inertia;

class ReceiptController extends Controller
{
    public function index()
    {
        $page_title = 'Receipt';
        $page_description = 'View receipts';
        $receipts = Receipt::all();

        return Inertia::render('receipt', [
            'receipts' => $receipts,
            'page_title' => $page_title,
            'page_description' => $page_description,
        ]);
    }
}
