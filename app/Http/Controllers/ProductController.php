<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $products = Product::query()
            ->with(['commissions', 'credits'])
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('product', [
            'products' => $products,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function destroy(Product $product) {
        $product->delete();
        return redirect()->back();
    }

    public function remove_commission($id)
    {
        $commission = ProductCommission::findOrFail($id);
        $commission->delete();
        return redirect()->back();
    }
}
