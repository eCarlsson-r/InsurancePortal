<?php

namespace App\Http\Controllers;

use App\Models\Policy;
use App\Models\Claim;
use App\Models\Customer;
use App\Models\Receipt;
use App\Services\ProductionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    protected $productionService;

    public function __construct(ProductionService $productionService)
    {
        $this->productionService = $productionService;
    }

    public function index()
    {
        // Get existing dashboard data from ProductionService
        $dashboard = $this->productionService->dashboard();

        // Calculate KPIs
        $kpis = [
            'new_policies' => $this->getNewPoliciesKPI(),
            'premium_collected' => $this->getPremiumCollectedKPI(),
            'mdrt_agents' => $this->getMDRTAgentsKPI($dashboard),
            'active_claims' => $this->getActiveClaimsKPI(),
            'expiring_policies' => $this->getExpiringPoliciesKPI(),
            'birthdays' => $this->getBirthdaysKPI(),
        ];

        return Inertia::render('dashboard', [
            'kpis' => $kpis,
            'empire_club' => $dashboard['empire_club'],
            'empire_stats' => $dashboard['empire_stats'],
            'mdrt' => $dashboard['mdrt'],
            'mdrt_stats' => $dashboard['mdrt_stats'],
        ]);
    }

    /**
     * Get new policies this month vs last month
     */
    private function getNewPoliciesKPI()
    {
        $now = Carbon::now();
        $lastMonth = $now->copy()->subMonth();

        $thisMonth = Policy::whereYear('entry_date', $now->year)
            ->whereMonth('entry_date', $now->month)
            ->count();

        $lastMonthCount = Policy::whereYear('entry_date', $lastMonth->year)
            ->whereMonth('entry_date', $lastMonth->month)
            ->count();

        $change = $thisMonth - $lastMonthCount;
        $percentageChange = $lastMonthCount > 0 
            ? round(($change / $lastMonthCount) * 100, 2) 
            : 0;

        return [
            'this_month' => $thisMonth,
            'last_month' => $lastMonthCount,
            'change' => $change,
            'percentage_change' => $percentageChange,
        ];
    }

    /**
     * Get premium collected this month
     */
    private function getPremiumCollectedKPI()
    {
        $now = Carbon::now();

        $amount = Receipt::whereYear('paid_date', $now->year)
            ->whereMonth('paid_date', $now->month)
            ->sum('paid_amount');

        return [
            'amount' => $amount,
            'formatted' => 'Rp ' . number_format($amount, 0, ',', '.'),
        ];
    }

    /**
     * Get MDRT agents count from existing dashboard data
     */
    private function getMDRTAgentsKPI($dashboard)
    {
        $mdrtAgents = collect($dashboard['mdrt'])->filter(function ($agent) {
            return !empty($agent->current_level);
        });

        return [
            'count' => $mdrtAgents->count(),
            'stats' => $dashboard['mdrt_stats'],
        ];
    }

    /**
     * Get active claims count
     */
    private function getActiveClaimsKPI()
    {
        $pending = Claim::where('status', 'pending')->count();
        $approved = Claim::where('status', 'approved')->count();
        $total = $pending + $approved;

        return [
            'count' => $total,
            'pending' => $pending,
            'approved' => $approved,
        ];
    }

    /**
     * Get expiring policies in next 30 days
     */
    private function getExpiringPoliciesKPI()
    {
        $now = Carbon::now();
        $thirtyDaysLater = $now->copy()->addDays(30);

        // Get all policies and filter in PHP for SQLite compatibility
        $expiringPolicies = Policy::with(['holder', 'insured', 'product'])
            ->get()
            ->filter(function ($policy) use ($now, $thirtyDaysLater) {
                $expiryDate = Carbon::parse($policy->start_date)->addYears($policy->insure_period);
                return $expiryDate->between($now, $thirtyDaysLater);
            });

        // Get top 5 for quick view
        $list = $expiringPolicies->take(5)->map(function ($policy) {
            $expiryDate = Carbon::parse($policy->start_date)->addYears($policy->insure_period);
            return [
                'policy_no' => $policy->policy_no,
                'holder_name' => $policy->holder->name ?? 'N/A',
                'product_name' => $policy->product->name ?? 'N/A',
                'expiry_date' => $expiryDate->format('Y-m-d'),
                'days_until_expiry' => abs(round($expiryDate->diffInDays(Carbon::now()))),
            ];
        });

        return [
            'count' => $expiringPolicies->count(),
            'list' => $list,
        ];
    }

    /**
     * Get birthdays this week
     */
    private function getBirthdaysKPI()
    {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        // Get customers who have policies and filter birthdays in PHP for SQLite compatibility
        $birthdays = Customer::where(function ($query) {
            $query->whereHas('policiesAsHolder')
                  ->orWhereHas('policiesAsInsured');
        })
        ->with(['policiesAsHolder', 'policiesAsInsured'])
        ->get()
        ->filter(function ($customer) use ($startOfWeek, $endOfWeek) {
            if (!$customer->birth_date) {
                return false;
            }
            
            $birthDate = Carbon::parse($customer->birth_date);
            $thisYearBirthday = Carbon::create(
                Carbon::now()->year,
                $birthDate->month,
                $birthDate->day
            );
            
            return $thisYearBirthday->between($startOfWeek, $endOfWeek);
        });

        // Format birthday list
        $list = $birthdays->map(function ($customer) {
            $birthDate = Carbon::parse($customer->birth_date);
            $thisYearBirthday = Carbon::create(
                Carbon::now()->year,
                $birthDate->month,
                $birthDate->day
            );
            
            return [
                'name' => $customer->name,
                'birth_date' => $birthDate->format('Y-m-d'),
                'birthday_this_year' => $thisYearBirthday->format('Y-m-d'),
                'age' => $birthDate->age + 1, // Age they will turn
                'days_until' => round(abs($thisYearBirthday->diffInDays(Carbon::now(), false))),
            ];
        })->sortBy('days_until');

        return [
            'count' => $birthdays->count(),
            'list' => $list->values(),
        ];
    }
}

// Made with Bob
