<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Policy;
use App\Models\Customer;
use App\Models\Claim;
use App\Models\Receipt;
use App\Models\Agent;
use App\Models\Product;
use App\Services\ProductionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow('2026-05-15 10:00:00'); // Set a fixed test time
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow(); // Reset time after tests
        parent::tearDown();
    }

    /**
     * Helper method to mock ProductionService dashboard response
     */
    protected function mockProductionService($mdrtData = [])
    {
        $mockService = Mockery::mock(ProductionService::class);
        $mockService->shouldReceive('dashboard')
            ->andReturn([
                'empire_club' => collect([]),
                'empire_stats' => collect([]),
                'mdrt' => collect($mdrtData),
                'mdrt_stats' => collect([]),
            ]);
        
        $this->app->instance(ProductionService::class, $mockService);
        
        return $mockService;
    }

    // ==========================================
    // Dashboard Index Tests
    // ==========================================

    public function test_authenticated_users_can_access_dashboard()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk();
    }

    public function test_dashboard_returns_all_kpi_data_in_correct_structure()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('kpis')
            ->has('kpis.new_policies')
            ->has('kpis.premium_collected')
            ->has('kpis.mdrt_agents')
            ->has('kpis.active_claims')
            ->has('kpis.expiring_policies')
            ->has('kpis.birthdays')
        );
    }

    public function test_dashboard_includes_empire_club_and_mdrt_data()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('empire_club')
            ->has('empire_stats')
            ->has('mdrt')
            ->has('mdrt_stats')
        );
    }

    public function test_unauthenticated_users_are_redirected_to_login()
    {
        $response = $this->get(route('dashboard'));

        $response->assertRedirect(route('login'));
    }

    // ==========================================
    // New Policies KPI Tests
    // ==========================================

    public function test_calculates_current_month_policy_count_correctly()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Create policies for current month (May 2026)
        Policy::factory()->count(5)->create([
            'entry_date' => '2026-05-10',
        ]);

        // Create policies for other months (should not be counted)
        Policy::factory()->count(3)->create([
            'entry_date' => '2026-04-10',
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.new_policies.this_month', 5)
        );
    }

    public function test_calculates_last_month_policy_count_correctly()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Create policies for last month (April 2026)
        Policy::factory()->count(3)->create([
            'entry_date' => '2026-04-15',
        ]);

        // Create policies for current month
        Policy::factory()->count(5)->create([
            'entry_date' => '2026-05-10',
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.new_policies.last_month', 3)
        );
    }

    public function test_calculates_change_correctly()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Last month: 3 policies
        Policy::factory()->count(3)->create([
            'entry_date' => '2026-04-15',
        ]);

        // This month: 8 policies
        Policy::factory()->count(8)->create([
            'entry_date' => '2026-05-10',
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.new_policies.change', 5) // 8 - 3 = 5
        );
    }

    public function test_calculates_percentage_change_correctly()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Last month: 4 policies
        Policy::factory()->count(4)->create([
            'entry_date' => '2026-04-15',
        ]);

        // This month: 6 policies
        Policy::factory()->count(6)->create([
            'entry_date' => '2026-05-10',
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        // Change: 6 - 4 = 2
        // Percentage: (2 / 4) * 100 = 50%
        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.new_policies.percentage_change', 50)
        );
    }

    public function test_handles_zero_last_month_policies()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // No policies last month
        // This month: 5 policies
        Policy::factory()->count(5)->create([
            'entry_date' => '2026-05-10',
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.new_policies.last_month', 0)
            ->where('kpis.new_policies.percentage_change', 0) // Should not divide by zero
        );
    }

    public function test_only_counts_policies_from_current_and_last_month()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Current month (May 2026)
        Policy::factory()->count(3)->create(['entry_date' => '2026-05-10']);

        // Last month (April 2026)
        Policy::factory()->count(2)->create(['entry_date' => '2026-04-10']);

        // Other months (should not be counted)
        Policy::factory()->count(5)->create(['entry_date' => '2026-03-10']);
        Policy::factory()->count(4)->create(['entry_date' => '2026-06-10']);
        Policy::factory()->count(3)->create(['entry_date' => '2025-05-10']);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.new_policies.this_month', 3)
            ->where('kpis.new_policies.last_month', 2)
        );
    }

    // ==========================================
    // Premium Collected KPI Tests
    // ==========================================

    public function test_sums_paid_amount_from_receipts_for_current_month()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Create receipts for current month (May 2026)
        Receipt::factory()->create([
            'paid_date' => '2026-05-05',
            'paid_amount' => 1000000,
        ]);
        Receipt::factory()->create([
            'paid_date' => '2026-05-15',
            'paid_amount' => 2500000,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.premium_collected.amount', 3500000)
        );
    }

    public function test_formats_amount_as_indonesian_rupiah()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        Receipt::factory()->create([
            'paid_date' => '2026-05-10',
            'paid_amount' => 1234567,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.premium_collected.formatted', 'Rp 1.234.567')
        );
    }

    public function test_returns_zero_when_no_receipts_exist()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.premium_collected.amount', 0)
            ->where('kpis.premium_collected.formatted', 'Rp 0')
        );
    }

    public function test_only_includes_receipts_from_current_month()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Current month (May 2026)
        Receipt::factory()->create([
            'paid_date' => '2026-05-10',
            'paid_amount' => 1000000,
        ]);

        // Other months (should not be counted)
        Receipt::factory()->create([
            'paid_date' => '2026-04-10',
            'paid_amount' => 2000000,
        ]);
        Receipt::factory()->create([
            'paid_date' => '2026-06-10',
            'paid_amount' => 3000000,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.premium_collected.amount', 1000000)
        );
    }

    public function test_ignores_receipts_from_other_months()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Create receipts for different months
        Receipt::factory()->create([
            'paid_date' => '2026-05-10',
            'paid_amount' => 500000,
        ]);
        Receipt::factory()->create([
            'paid_date' => '2025-05-10',
            'paid_amount' => 1000000,
        ]);
        Receipt::factory()->create([
            'paid_date' => '2026-03-10',
            'paid_amount' => 750000,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        // Only May 2026 receipt should be counted
        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.premium_collected.amount', 500000)
        );
    }

    // ==========================================
    // MDRT Agents KPI Tests
    // ==========================================

    public function test_counts_agents_with_non_empty_current_level()
    {
        $user = User::factory()->create();

        // Mock MDRT data with agents having current_level
        $mdrtData = [
            (object)['agent_name' => 'Agent 1', 'current_level' => 'MDRT'],
            (object)['agent_name' => 'Agent 2', 'current_level' => 'COT'],
            (object)['agent_name' => 'Agent 3', 'current_level' => null],
            (object)['agent_name' => 'Agent 4', 'current_level' => ''],
            (object)['agent_name' => 'Agent 5', 'current_level' => 'TOT'],
        ];

        $this->mockProductionService($mdrtData);

        $response = $this->actingAs($user)->get(route('dashboard'));

        // Should count only agents with non-empty current_level (3 agents)
        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.mdrt_agents.count', 3)
        );
    }

    public function test_returns_zero_when_no_mdrt_agents_exist()
    {
        $user = User::factory()->create();

        // Mock MDRT data with no agents having current_level
        $mdrtData = [
            (object)['agent_name' => 'Agent 1', 'current_level' => null],
            (object)['agent_name' => 'Agent 2', 'current_level' => ''],
        ];

        $this->mockProductionService($mdrtData);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.mdrt_agents.count', 0)
        );
    }

    public function test_integrates_with_production_service_correctly()
    {
        $user = User::factory()->create();

        $mdrtData = [
            (object)['agent_name' => 'Agent 1', 'current_level' => 'MDRT'],
        ];

        $mockService = $this->mockProductionService($mdrtData);

        // Verify the service is called
        $this->actingAs($user)->get(route('dashboard'));

        $mockService->shouldHaveReceived('dashboard')->once();
    }

    public function test_includes_stats_data_in_response()
    {
        $user = User::factory()->create();

        $this->mockProductionService();

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('kpis.mdrt_agents.stats')
        );
    }

    // ==========================================
    // Active Claims KPI Tests
    // ==========================================

    public function test_counts_total_active_claims()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Create active claims (pending + approved)
        Claim::factory()->count(3)->create(['status' => 'pending']);
        Claim::factory()->count(2)->create(['status' => 'approved']);

        // Create inactive claims (should not be counted)
        Claim::factory()->count(2)->create(['status' => 'rejected']);
        Claim::factory()->count(1)->create(['status' => 'paid']);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.active_claims.count', 5) // 3 pending + 2 approved
        );
    }

    public function test_counts_pending_claims_separately()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        Claim::factory()->count(4)->create(['status' => 'pending']);
        Claim::factory()->count(2)->create(['status' => 'approved']);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.active_claims.pending', 4)
        );
    }

    public function test_counts_approved_claims_separately()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        Claim::factory()->count(3)->create(['status' => 'pending']);
        Claim::factory()->count(5)->create(['status' => 'approved']);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.active_claims.approved', 5)
        );
    }

    public function test_excludes_rejected_and_paid_claims()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Active claims
        Claim::factory()->count(2)->create(['status' => 'pending']);
        Claim::factory()->count(1)->create(['status' => 'approved']);

        // Inactive claims (should be excluded)
        Claim::factory()->count(3)->create(['status' => 'rejected']);
        Claim::factory()->count(2)->create(['status' => 'paid']);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.active_claims.count', 3) // Only pending + approved
            ->where('kpis.active_claims.pending', 2)
            ->where('kpis.active_claims.approved', 1)
        );
    }

    public function test_returns_zero_when_no_active_claims_exist()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Create only inactive claims
        Claim::factory()->count(2)->create(['status' => 'rejected']);
        Claim::factory()->count(1)->create(['status' => 'paid']);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.active_claims.count', 0)
            ->where('kpis.active_claims.pending', 0)
            ->where('kpis.active_claims.approved', 0)
        );
    }

    // ==========================================
    // Expiring Policies KPI Tests
    // ==========================================

    public function test_finds_policies_expiring_in_next_30_days()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Policy expiring in 15 days
        Policy::factory()->create([
            'start_date' => Carbon::now()->subYears(5)->addDays(15)->format('Y-m-d'),
            'insure_period' => 5,
        ]);

        // Policy expiring in 25 days
        Policy::factory()->create([
            'start_date' => Carbon::now()->subYears(3)->addDays(25)->format('Y-m-d'),
            'insure_period' => 3,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.expiring_policies.count', 2)
        );
    }

    public function test_calculates_days_until_expiry_correctly()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Policy expiring in exactly 10 days
        $policy = Policy::factory()->create([
            'start_date' => Carbon::now()->subYears(2)->addDays(10)->format('Y-m-d'),
            'insure_period' => 2,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.expiring_policies.list.0.days_until_expiry', 10)
        );
    }

    public function test_returns_top_5_policies_only()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Create 8 policies expiring in next 30 days
        for ($i = 1; $i <= 8; $i++) {
            Policy::factory()->create([
                'start_date' => Carbon::now()->subYears(1)->addDays($i)->format('Y-m-d'),
                'insure_period' => 1,
            ]);
        }

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.expiring_policies.count', 8)
            ->where('kpis.expiring_policies.list', fn ($list) => count($list) === 5)
        );
    }

    public function test_includes_policy_relationships()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        $holder = Customer::factory()->create(['name' => 'John Holder']);
        $insured = Customer::factory()->create(['name' => 'Jane Insured']);
        $agent = Agent::factory()->create(['name' => 'Agent Smith']);
        $product = Product::factory()->create(['name' => 'Life Insurance']);

        Policy::factory()->create([
            'policy_no' => 'POL123456',
            'holder_id' => $holder->id,
            'insured_id' => $insured->id,
            'agent_id' => $agent->id,
            'product_id' => $product->id,
            'start_date' => Carbon::now()->subYears(1)->addDays(15)->format('Y-m-d'),
            'insure_period' => 1,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.expiring_policies.list.0.policy_no', 'POL123456')
            ->where('kpis.expiring_policies.list.0.holder_name', 'John Holder')
            ->where('kpis.expiring_policies.list.0.product_name', 'Life Insurance')
        );
    }

    public function test_excludes_already_expired_policies()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Policy that expired 5 days ago
        Policy::factory()->create([
            'start_date' => Carbon::now()->subYears(2)->subDays(5)->format('Y-m-d'),
            'insure_period' => 2,
        ]);

        // Policy expiring in 10 days (should be included)
        Policy::factory()->create([
            'start_date' => Carbon::now()->subYears(1)->addDays(10)->format('Y-m-d'),
            'insure_period' => 1,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.expiring_policies.count', 1)
        );
    }

    public function test_excludes_policies_expiring_after_30_days()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Policy expiring in 35 days (should be excluded)
        Policy::factory()->create([
            'start_date' => Carbon::now()->subYears(1)->addDays(35)->format('Y-m-d'),
            'insure_period' => 1,
        ]);

        // Policy expiring in 20 days (should be included)
        Policy::factory()->create([
            'start_date' => Carbon::now()->subYears(1)->addDays(20)->format('Y-m-d'),
            'insure_period' => 1,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.expiring_policies.count', 1)
        );
    }

    // ==========================================
    // Birthdays KPI Tests
    // ==========================================

    public function test_finds_customers_with_birthdays_this_week()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Customer with birthday this week (May 12-18, 2026)
        $customer1 = Customer::factory()->create([
            'birth_date' => '1990-05-16', // Friday this week
        ]);
        Policy::factory()->create(['holder_id' => $customer1->id]);

        // Customer with birthday next week (should not be included)
        $customer2 = Customer::factory()->create([
            'birth_date' => '1985-05-22',
        ]);
        Policy::factory()->create(['holder_id' => $customer2->id]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.birthdays.count', 1)
        );
    }

    public function test_calculates_age_correctly()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Customer born in 1990, will turn 37 in 2026
        $customer = Customer::factory()->create([
            'name' => 'John Doe',
            'birth_date' => '1990-05-16',
        ]);
        Policy::factory()->create(['holder_id' => $customer->id]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.birthdays.list.0.age', 36) // Age they will turn
        );
    }

    public function test_calculates_days_until_birthday_correctly()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Test time is May 15, 2026
        // Customer birthday is May 16 (tomorrow, 1 day away)
        $customer = Customer::factory()->create([
            'birth_date' => '1990-05-16',
        ]);
        Policy::factory()->create(['holder_id' => $customer->id]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.birthdays.list.0.days_until', 1)
        );
    }

    public function test_only_includes_customers_who_have_policies()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Customer with policy and birthday this week
        $customerWithPolicy = Customer::factory()->create([
            'birth_date' => '1990-05-16',
        ]);
        Policy::factory()->create(['holder_id' => $customerWithPolicy->id]);

        // Customer without policy but birthday this week (should not be included)
        Customer::factory()->create([
            'birth_date' => '1985-05-17',
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.birthdays.count', 1)
        );
    }

    public function test_excludes_customers_without_policies()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Create customers with birthdays this week but no policies
        Customer::factory()->count(3)->create([
            'birth_date' => '1990-05-16',
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.birthdays.count', 0)
        );
    }

    public function test_handles_leap_year_birthdays_correctly()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Set test time to a week that includes Feb 29 in a leap year
        Carbon::setTestNow('2024-02-27 10:00:00'); // 2024 is a leap year

        // Customer born on leap day
        $customer = Customer::factory()->create([
            'birth_date' => '1992-02-29', // Leap year birthday
        ]);
        Policy::factory()->create(['holder_id' => $customer->id]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        // Should find the customer since Feb 29 falls within the week
        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.birthdays.count', 1)
        );
    }

    public function test_includes_customers_as_both_holder_and_insured()
    {
        $this->mockProductionService();
        $user = User::factory()->create();

        // Customer as policy holder
        $customerAsHolder = Customer::factory()->create([
            'birth_date' => '1990-05-16',
        ]);
        Policy::factory()->create(['holder_id' => $customerAsHolder->id]);

        // Customer as insured person
        $customerAsInsured = Customer::factory()->create([
            'birth_date' => '1985-05-17',
        ]);
        Policy::factory()->create(['insured_id' => $customerAsInsured->id]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('kpis.birthdays.count', 2)
        );
    }
}
