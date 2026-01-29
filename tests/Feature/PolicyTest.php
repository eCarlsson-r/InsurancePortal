<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Policy;
use App\Models\Customer;
use App\Models\Agent;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PolicyTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_policy_index_page_can_be_rendered()
    {
        $response = $this->actingAs($this->user)->get(route('sales.policy.index'));

        $response->assertOk();
    }

    public function test_policy_create_page_can_be_rendered()
    {
        $response = $this->actingAs($this->user)->get(route('sales.policy.create'));

        $response->assertOk();
    }

    public function test_policy_can_be_stored()
    {
        $holderData = Customer::factory()->make()->toArray();
        $insuredData = Customer::factory()->make()->toArray();
        $agent = Agent::factory()->create(['agency_id' => 1, 'recruiter_id' => 1]);
        $product = Product::factory()->create();

        $policyData = [
            'policy_no' => 'POL123456',
            'holder' => $holderData,
            'insured' => $insuredData,
            'agent_id' => $agent->id,
            'holder_insured_relationship' => 'Self',
            'entry_date' => now()->format('Y-m-d'),
            'bill_at' => 1,
            'is_insure_holder' => false,
            'product_id' => $product->id,
            'insure_period' => 20,
            'pay_period' => 10,
            'currency_id' => 1,
            'curr_rate' => 1.0,
            'start_date' => now()->format('Y-m-d'),
            'base_insure' => 50000000,
            'premium' => 1000000,
            'pay_method' => 1,
            'description' => 'Test Policy',
        ];

        $response = $this->actingAs($this->user)->post(route('sales.policy.store'), $policyData);

        $response->assertRedirect(route('sales.policy.index'));
        $this->assertDatabaseHas('cases', [
            'policy_no' => 'POL123456',
        ]);
        $this->assertDatabaseHas('customers', [
            'identity' => $holderData['identity'],
        ]);
    }
}
