<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        $page_title = 'Product';
        $page_description = 'View products';
        $products = Product::with(['commissions', 'credits'])->get();

        return Inertia::render('product', [
            'products' => $products,
            'page_title' => $page_title,
            'page_description' => $page_description,
        ]);
    }
}
