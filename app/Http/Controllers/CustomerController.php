<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $customers = Customer::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('identity', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('customer/index', [
            'customers' => $customers,
            'filters' => [
                'search' => $search,
            ],
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

    public function store(Request $request) {
        $customerData = $request->validate([
            'name' => 'required',
            'gender' => 'required',
            'identity' => 'nullable',
            'mobile' => 'nullable',
            'email' => 'nullable',
            'birth_date' => 'required',
            'birth_place' => 'required',
            'religion' => 'required',
            'marital' => 'required',
            'profession' => 'required',
            'home_address' => 'nullable',
            'home_postal' => 'nullable',
            'home_city' => 'nullable',
            'work_address' => 'nullable',
            'work_postal' => 'nullable',
            'work_city' => 'nullable',
            'notes' => 'nullable'
        ]);

        Customer::create($customerData);

        return redirect()->route('master.customer.index');
    }

    public function update(Request $request, Customer $customer) {
        $agencyData = $request->validate([
            'name' => 'required',
            'gender' => 'required',
            'identity' => 'nullable',
            'mobile' => 'nullable',
            'email' => 'nullable',
            'birth_date' => 'required',
            'birth_place' => 'required',
            'religion' => 'required',
            'marital' => 'required',
            'profession' => 'required',
            'home_address' => 'nullable',
            'home_postal' => 'nullable',
            'home_city' => 'nullable',
            'work_address' => 'nullable',
            'work_postal' => 'nullable',
            'work_city' => 'nullable',
            'notes' => 'nullable'
        ]);

        $customer->update($customerData);

        return redirect()->route('master.customer.index');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->back();
    }

    public function report_cases (Request $request)
    {
        $customers = $request->input('policy-customers', []);

        if (empty($customers)) {
            return response()->json([]);
        }

        return \App\Models\Policy::query()
            ->selectRaw("
                cases.policy_no,
                cases.agent_id as case_subagent,
                ag.official_number as agent_code,
                holder.name as customer_name,
                insured.name as insured_name,
                cases.start_date as case_start_date,
                DATE_FORMAT(cases.start_date, '%m %Y') as case_month,
                'PP' as status_polis,
                cases.pay_method as case_pay_method,
                cases.currency_id as case_currency,
                cases.curr_rate as case_curr_rate,
                cases.product_id as case_product,
                cases.base_insure as case_base_insure,
                pcr.production_credit,
                pcr.contest_credit,
                rpc.production_credit as topup_production_credit,
                rpc.contest_credit as topup_contest_credit,
                COALESCE(ROUND(cases.premium), 0) as case_premium,
                COALESCE(ROUND(rd.premium), 0) as topup_premium,
                (
                    COALESCE(ROUND(((pc.commission_rate + pc.extra_commission) / 100) * (cases.premium * cases.curr_rate)), 0) +
                    COALESCE(ROUND((tc.commission_rate / 100) * rd.premium), 0)
                ) as commision
            ")
            ->join('customers as holder', 'cases.holder_id', '=', 'holder.id')
            ->join('customers as insured', 'cases.insured_id', '=', 'insured.id')
            ->join('products as pr', 'cases.product_id', '=', 'pr.id')
            ->join('product_credits as pcr', function ($join) {
                $join->on('pr.id', '=', 'pcr.product_id')
                     ->whereRaw('cases.start_date BETWEEN pcr.credit_start AND IFNULL(pcr.credit_end, CURDATE())');
            })
            ->leftJoin('product_commissions as pc', function ($join) {
                $join->on('cases.product_id', '=', 'pc.product_id')
                     ->on('cases.pay_method', '=', 'pc.payment_method')
                     ->on('cases.currency_id', '=', 'pc.currency')
                     ->where(function ($query) {
                         $query->whereRaw('pc.payment_period IS NULL')
                               ->orWhereRaw('pc.payment_period = cases.pay_period');
                     });
            })
            ->leftJoin('riders as rd', function ($join) {
                $join->on('cases.id', '=', 'rd.case_id')
                     ->whereIn('rd.product_id', function ($query) {
                         $query->select('id')
                               ->from('products')
                               ->where('name', 'TUR');
                     });
            })
            ->leftJoin('product_commissions as tc', 'rd.product_id', '=', 'tc.product_id')
            ->leftJoin('products as rp', 'rd.product_id', '=', 'rp.id')
            ->leftJoin('product_credits as rpc', function ($join) {
                $join->on('rp.id', '=', 'rpc.product_id')
                     ->whereRaw('cases.start_date BETWEEN rpc.credit_start AND IFNULL(rpc.credit_end, CURDATE())');
            })
            ->join('agents as ag', 'cases.agent_id', '=', 'ag.id')
            ->whereIn('holder.id', $customers)
            ->get();
    }

    public function report_birthday(Request $request)
    {
        $month = $request->input('month');

        $customers = Customer::query()
            ->select('name', 'birth_date', 'religion')
            ->whereMonth('birth_date', $month)
            ->get()
            ->append(['age', 'address']);

        return Inertia::render('report/birthday', [
            'month' => $month,
            'customers' => $customers
        ]);
    }

    public function report_religion (Request $request) {
        $religion = $request->input('religion');

        $customers = Customer::query()
            ->select('name', 'birth_date', 'religion', 'home_address', 'home_city', 'home_postal')
            ->where('religion', $religion)
            ->get()
            ->append(['age', 'address']);

        return Inertia::render('report/religion', [
            'religion' => $religion,
            'customers' => $customers
        ]);
    }
}
