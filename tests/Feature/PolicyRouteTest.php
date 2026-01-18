<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Policy;
use App\Models\Customer;
use App\Models\Agent;
use App\Models\Product;
use App\Models\Agency;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PolicyRouteTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        $this->user = User::factory()->create();
    }

    public function test_policy_index_route()
    {
        $response = $this->actingAs($this->user)->get(route('sales.policy.index'));
        $response->assertStatus(200);
    }

    public function test_policy_create_route()
    {
        $response = $this->actingAs($this->user)->get(route('sales.policy.create'));
        $response->assertStatus(200);
    }

    public function test_policy_edit_route()
    {
        $customer = Customer::create([
            'name' => 'John Doe',
            'gender' => 1,
            'identity' => 'ID123',
            'mobile' => '123',
            'email' => 'a@b.com',
            'birth_date' => now(),
            'birth_place' => 'X',
            'religion' => 1,
            'marital' => 1,
            'profession' => 'P',
            'home_address' => 'A',
            'home_postal' => '1',
            'home_city' => 'C',
            'work_address' => 'W',
            'work_postal' => '2',
            'work_city' => 'K',
            'description' => 'D',
        ]);
        $agency = Agency::create(['name' => 'Test Agency']);
        $agent = Agent::create([
            'name' => 'Agent Smith', 
            'agency_id' => $agency->id,
            'official_number' => 1,
            'apply_date' => now(),
            'apply_place' => 'X',
            'gender' => 1,
            'birth_place' => 'X',
            'birth_date' => now(),
            'address' => 'A',
            'religion' => 1,
            'identity_number' => 'ID001',
            'tax_number' => 'T001',
            'city' => 'C',
            'province' => 'P',
            'postal_code' => '1',
            'education' => 'E',
            'phone' => '1',
            'mobile' => '1',
            'email' => 'e@a.com',
            'status' => 1,
            'spouse' => 'S',
            'occupation' => 'O',
            'dependents' => 0,
            'license' => 'L',
            'due_date' => now(),
            'recruiter_id' => 1,
            'notes' => 'N'
        ]);
        $product = Product::create(['name' => 'Safe Policy', 'type' => 'T']);

        $policy = Policy::create([
            'policy_no' => 'POL-001',
            'holder_id' => $customer->id,
            'insured_id' => $customer->id,
            'agent_id' => $agent->id,
            'product_id' => $product->id,
            'entry_date' => now(),
            'start_date' => now(),
            'bill_at' => 1,
            'is_insure_holder' => true,
            'insure_period' => 1,
            'pay_period' => 1,
            'currency_id' => 1,
            'curr_rate' => 1,
            'base_insure' => 1000,
            'premium' => 100,
            'pay_method' => 1,
            'description' => 'Test'
        ]);

        $response = $this->actingAs($this->user)->get(route('sales.policy.edit', $policy->id));
        $response->assertStatus(200);
    }

    public function test_policy_process_ocr_route_exists()
    {
        $response = $this->actingAs($this->user)->post(route('sales.policy.process-ocr'));
        $response->assertStatus(302);
    }
}
