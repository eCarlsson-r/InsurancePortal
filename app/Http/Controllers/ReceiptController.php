<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Receipt;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Agent;
use App\Models\Policy;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReceiptController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $receipts = Receipt::query()->with('policy')
            ->when($search, function ($query, $search) {
                $query->whereHas('policy', function ($query) use ($search) {
                    $query->where('policy_no', 'like', "%{$search}%");
                });
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('receipt', [
            'receipts' => $receipts,
            'customers' => Customer::all(),
            'products' => Product::all(),
            'agents' => Agent::all(),
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function store(Request $request)
    {
        $receiptData = $request->validate([
            'case_id' => 'required|string',
            'agent_id' => 'required|string',
            'premium' => 'required|numeric',
            'currency_rate' => 'required|numeric',
            'pay_method' => 'required|string',
            'pay_date' => 'required|date',
            'paid_date' => 'required|date',
            'paid_amount' => 'required|numeric',
            'description' => 'required|string',
        ]);

        Receipt::create($receiptData);

        return redirect()->route('master.receipt.index');
    }

    public function update(Request $request, Receipt $receipt)
    {
        $receiptData = $request->validate([
            'case_id' => 'required|string',
            'agent_id' => 'required|string',
            'premium' => 'required|numeric',
            'currency_rate' => 'required|numeric',
            'pay_method' => 'required|string',
            'pay_date' => 'required|date',
            'paid_date' => 'required|date',
            'paid_amount' => 'required|numeric',
            'description' => 'required|string',
        ]);

        $receipt->update($receiptData);

        return redirect()->route('master.receipt.index');
    }

    public function destroy(Receipt $receipt) {
        $receipt->delete();
        return redirect()->back();
    }

    public function report_due_date(Request $request) {
        // Parse month and year from request
        $monthYear = explode("-", $request->input('month', date('Y-m')));
        $year = $monthYear[0] ?? date("Y");
        $month = $monthYear[1] ?? date("m");
        $agent = $request->input('agent');

        $query = Policy::query()
            ->select([
                'agents.official_number as agent_code',
                'cases.policy_no as receipt_policy',
                'customers.name as customer_name',
                'insured.name as insured_name',
                'insured.birth_date as insured_birthdate',
                'products.name as case_product',
                DB::raw('COALESCE(latest_receipt.pay_method, cases.pay_method) as receipt_pay_method'),
                
                // Complex premium calculation based on payment method conversion
                DB::raw('ROUND(
                    IF(
                        COALESCE(latest_receipt.pay_method, cases.pay_method) = cases.pay_method 
                        OR latest_receipt.pay_method IS NULL,
                        (cases.premium + COALESCE(SUM(riders.premium), 0)),
                        CASE cases.pay_method
                            WHEN 1 THEN ((cases.premium + COALESCE(SUM(riders.premium), 0)) / 12) * 
                                CASE COALESCE(latest_receipt.pay_method, cases.pay_method)
                                    WHEN 4 THEN 3
                                    WHEN 2 THEN 6
                                    WHEN 1 THEN 12
                                    ELSE 1
                                END
                            WHEN 2 THEN ((cases.premium + COALESCE(SUM(riders.premium), 0)) / 6) * 
                                CASE COALESCE(latest_receipt.pay_method, cases.pay_method)
                                    WHEN 4 THEN 3
                                    WHEN 2 THEN 6
                                    WHEN 1 THEN 12
                                    ELSE 1
                                END
                            WHEN 4 THEN ((cases.premium + COALESCE(SUM(riders.premium), 0)) / 3) * 
                                CASE COALESCE(latest_receipt.pay_method, cases.pay_method)
                                    WHEN 4 THEN 3
                                    WHEN 2 THEN 6
                                    WHEN 1 THEN 12
                                    ELSE 1
                                END
                            WHEN 12 THEN (cases.premium + COALESCE(SUM(riders.premium), 0)) * 
                                CASE COALESCE(latest_receipt.pay_method, cases.pay_method)
                                    WHEN 4 THEN 3
                                    WHEN 2 THEN 6
                                    WHEN 1 THEN 12
                                    ELSE 1
                                END
                            ELSE (cases.premium + COALESCE(SUM(riders.premium), 0))
                        END
                    )
                ) as receipt_premium'),
                
                // Calculate next due date based on payment method
                DB::raw('
                    CASE COALESCE(latest_receipt.pay_method, cases.pay_method)
                        WHEN 1 THEN DATE_ADD(COALESCE(latest_receipt.pay_date, cases.start_date), INTERVAL 1 YEAR)
                        WHEN 2 THEN DATE_ADD(COALESCE(latest_receipt.pay_date, cases.start_date), INTERVAL 6 MONTH)
                        WHEN 4 THEN DATE_ADD(COALESCE(latest_receipt.pay_date, cases.start_date), INTERVAL 3 MONTH)
                        ELSE DATE_ADD(COALESCE(latest_receipt.pay_date, cases.start_date), INTERVAL 1 MONTH)
                    END as receipt_pay_date
                '),
                
                // Customer address (work or home)
                DB::raw("
                    IF(
                        customers.work_address <> '',
                        CONCAT(customers.work_address, ', ', customers.work_city, ', ', customers.work_postal),
                        CONCAT(customers.home_address, ', ', customers.home_city, ', ', customers.home_postal)
                    ) as customer_address
                ")
            ])
            ->from('cases')
            ->join('customers', 'cases.holder_id', '=', 'customers.id')
            ->join('customers as insured', 'cases.insured_id', '=', 'insured.id')
            ->join('agents', 'cases.agent_id', '=', 'agents.id')
            ->join('products', 'cases.product_id', '=', 'products.id')
            
            // LEFT JOIN to get the latest receipt for each policy
            ->leftJoin('receipts as latest_receipt', function($join) {
                $join->on('cases.id', '=', 'latest_receipt.case_id')
                    ->whereRaw('latest_receipt.pay_date = (
                        SELECT MAX(r.pay_date) 
                        FROM receipts AS r 
                        WHERE r.case_id = cases.id
                    )');
            })
            
            // LEFT JOIN riders, excluding 'UL' type
            ->leftJoin('riders', function($join) {
                $join->on('cases.id', '=', 'riders.case_id')
                    ->where('riders.product_id', '<>', 'UL');
            })
            
            ->groupBy([
                'cases.policy_no',
                'agents.official_number', 
                'customers.name',
                'insured.name',
                'insured.birth_date',
                'products.name',
                'cases.pay_method',
                'cases.premium',
                'cases.start_date',
                'latest_receipt.pay_method',
                'latest_receipt.pay_date',
                'customers.work_address',
                'customers.work_city',
                'customers.work_postal',
                'customers.home_address',
                'customers.home_city',
                'customers.home_postal'
            ])
            
            // Filter by agent if specified
            ->when($agent, function($query) use ($agent) {
                return $query->where('agents.official_number', Agent::findOrFail($agent)->official_number);
            })
            
            // Filter by year and month of due date
            ->havingRaw('YEAR(receipt_pay_date) = ?', [$year])
            ->havingRaw('MONTH(receipt_pay_date) = ?', [$month])
            
            ->orderBy(DB::raw('receipt_pay_date'));

        return Inertia::render('report/duedate', [
            'data' => $query->get(),
            'agents' => Agent::all(),
            'month' => $request->input('month'),
            'agent' => $agent,
        ]);
    }

}
