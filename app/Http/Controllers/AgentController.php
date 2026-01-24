<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Program;
use App\Models\Agency;
use App\Services\ProductionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class AgentController extends Controller
{
    protected $productionService;

    public function __construct(ProductionService $productionService)
    {
        $this->productionService = $productionService;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');

        $agents = Agent::query()
            ->with('programs')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('official_number', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('agent/index', [
            'agents' => $agents,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function create()
    {
        $page_title = 'Agen Baru';
        $page_description = 'Input Data Agen';
        $logo = "images/logo.png";
        $logoText = "images/logo-text.png";
        $action = __FUNCTION__;

        return Inertia::render('agent/form', [
            'agents' => Agent::all(),
            'agencies' => Agency::all(),
            'programs' => Program::all()
        ]);
    }

    public function edit($id)
    {
        $page_title = 'Sunting Agen';
        $page_description = 'Sunting Data Agen';
        $logo = "images/logo.png";
        $logoText = "images/logo-text.png";
        $action = __FUNCTION__;

        $agent = Agent::findOrFail($id);

        return Inertia::render('agent/form', [
            'agent' => $agent,
            'agents' => Agent::all(),
            'agencies' => Agency::all(),
            'programs' => Program::all()
        ]);
    }

    public function store(Request $request) {
        $agentData = $request->validate([
            'official_number' => 'required',
            'apply_date' => 'required',
            'apply_place' => 'required',
            'agency_id' => 'required',
            'name' => 'required',
            'gender' => 'required',
            'birth_place' => 'required',
            'birth_date' => 'required',
            'address' => 'required',
            'religion' => 'required',
            'identity_number' => 'required',
            'tax_number' => 'nullable',
            'city' => 'required',
            'province' => 'required',
            'postal_code' => 'required',
            'education' => 'required',
            'phone' => 'nullable',
            'mobile' => 'required',
            'email' => 'nullable',
            'status' => 'required',
            'spouse' => 'nullable',
            'occupation' => 'required',
            'dependents' => 'required',
            'license' => 'nullable',
            'due_date' => 'nullable',
            'recruiter_id' => 'required',
            'notes' => 'nullable',
        ]);

        Agent::create($agentData);

        return redirect()->route('master.agent.index');
    }

    public function update(Request $request, $id) {
        $agent = Agent::findOrFail($id);

        $agent->update([
            'apply_date' => $request->apply_date,
            'apply_place' => $request->apply_place,
            'agency_id' => $request->agency_id,
            'gender' => $request->gender,
            'birth_place' => $request->birth_place,
            'birth_date' => $request->birth_date,
            'address' => $request->address,
            'city' => $request->city,
            'province' => $request->province,
            'postal_code' => $request->postal_code,
            'education' => $request->education,
            'phone' => $request->phone,
            'mobile' => $request->mobile,
            'email' => $request->email,
            'status' => $request->status,
            'spouse' => $request->spouse,
            'occupation' => $request->occupation,
            'dependents' => $request->dependents,
            'notes' => $request->notes,
        ]);

        return Redirect::route('master.agent.index')->with('message', 'Data Berhasil Diperbarui!');
    }

    public function destroy(Agent $agent) {
        $agent->delete();
        return redirect()->back();
    }

    public function report_monthly(Request $request) {
        $monthYear = explode("-", $request["report_month"]);
        $month = (isset($request["report_month"])) ? $monthYear[1] : date("m");
        $year = (isset($request["report_month"])) ? $monthYear[0] : date("Y");

        $data = $this->productionService->reportMonthly($year, $month);

        return Inertia::render("report/monthly", [
            "data" => $data,
            "report_month" => $request["report_month"]
        ]);
    }

    public function report_semester(Request $request) {
        $year = $request->year;
        $data = $this->productionService->reportSemester($year);

        return Inertia::render("report/semester", [
            "data" => $data,
            "year" => $year
        ]);
    }

    public function report_annual(Request $request) {
        $year = $request->year;
        $data = $this->productionService->reportAnnual($year);

        return Inertia::render("report/annual", [
            "data" => $data,
            "year" => $year
        ]);
    }
}
