<?php

namespace Tests\Feature;

use App\Models\Claim;
use App\Models\Policy;
use App\Models\User;
use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class ClaimControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ==================== INDEX METHOD TESTS ====================

    /** @test */
    public function test_authenticated_users_can_view_claims_list()
    {
        $claims = Claim::factory()->count(3)->create();

        $response = $this->actingAs($this->user)
            ->get(route('sales.claim.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('claim/index')
                ->has('claims.data', 3)
        );
    }

    /** @test */
    public function test_claims_list_includes_proper_relationships()
    {
        $policy = Policy::factory()->create();
        $claim = Claim::factory()->create(['policy_id' => $policy->id]);

        $response = $this->actingAs($this->user)
            ->get(route('sales.claim.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('claim/index')
                ->has('claims.data.0.policy')
                ->has('claims.data.0.policy.holder')
                ->has('claims.data.0.policy.insured')
                ->has('claims.data.0.user')
        );
    }

    /** @test */
    public function test_search_filtering_works_by_claim_number()
    {
        $claim1 = Claim::factory()->create(['claim_number' => 'CLM-2024-001']);
        $claim2 = Claim::factory()->create(['claim_number' => 'CLM-2024-002']);

        $response = $this->actingAs($this->user)
            ->get(route('sales.claim.index', ['q' => 'CLM-2024-001']));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('claim/index')
                ->has('claims.data', 1)
                ->where('claims.data.0.claim_number', 'CLM-2024-001')
                ->where('filters.q', 'CLM-2024-001')
        );
    }

    /** @test */
    public function test_search_filtering_works_by_policy_number()
    {
        $policy1 = Policy::factory()->create(['policy_no' => 'POL-001']);
        $policy2 = Policy::factory()->create(['policy_no' => 'POL-002']);
        
        $claim1 = Claim::factory()->create(['policy_id' => $policy1->id]);
        $claim2 = Claim::factory()->create(['policy_id' => $policy2->id]);

        $response = $this->actingAs($this->user)
            ->get(route('sales.claim.index', ['q' => 'POL-001']));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('claim/index')
                ->has('claims.data', 1)
        );
    }

    /** @test */
    public function test_search_filtering_works_by_holder_name()
    {
        $holder = Customer::factory()->create(['name' => 'John Doe']);
        $policy = Policy::factory()->create(['holder_id' => $holder->id]);
        $claim = Claim::factory()->create(['policy_id' => $policy->id]);

        $response = $this->actingAs($this->user)
            ->get(route('sales.claim.index', ['q' => 'John']));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('claim/index')
                ->has('claims.data', 1)
        );
    }

    /** @test */
    public function test_status_filtering_works_correctly()
    {
        Claim::factory()->pending()->create();
        Claim::factory()->approved()->create();
        Claim::factory()->rejected()->create();

        $response = $this->actingAs($this->user)
            ->get(route('sales.claim.index', ['status' => 'pending']));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('claim/index')
                ->has('claims.data', 1)
                ->where('claims.data.0.status', 'pending')
                ->where('filters.status', 'pending')
        );
    }

    /** @test */
    public function test_claim_type_filtering_works_correctly()
    {
        Claim::factory()->create(['claim_type' => 'Death']);
        Claim::factory()->create(['claim_type' => 'Medical']);
        Claim::factory()->create(['claim_type' => 'Accident']);

        $response = $this->actingAs($this->user)
            ->get(route('sales.claim.index', ['claim_type' => 'Death']));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('claim/index')
                ->has('claims.data', 1)
                ->where('claims.data.0.claim_type', 'Death')
                ->where('filters.claim_type', 'Death')
        );
    }

    // ==================== STORE METHOD TESTS ====================

    /** @test */
    public function test_creating_claim_with_valid_data()
    {
        $policy = Policy::factory()->create();
        $user = User::factory()->create();

        $claimData = [
            'claim_number' => 'CLM-2024-TEST',
            'policy_id' => $policy->id,
            'user_id' => $user->id,
            'claim_type' => 'Death',
            'claim_date' => '2024-01-15',
            'claim_amount' => 50000000,
            'description' => 'Test claim description',
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertRedirect(route('sales.claim.index'));
        $response->assertSessionHas('message', 'Klaim Berhasil Disimpan!');

        $this->assertDatabaseHas('claims', [
            'claim_number' => 'CLM-2024-TEST',
            'policy_id' => $policy->id,
            'user_id' => $user->id,
            'claim_type' => 'Death',
            'claim_amount' => 50000000,
            'status' => 'pending',
        ]);
    }

    /** @test */
    public function test_claim_number_is_required()
    {
        $policy = Policy::factory()->create();
        $user = User::factory()->create();

        $claimData = [
            'policy_id' => $policy->id,
            'user_id' => $user->id,
            'claim_type' => 'Death',
            'claim_date' => '2024-01-15',
            'claim_amount' => 50000000,
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertSessionHasErrors('claim_number');
    }

    /** @test */
    public function test_policy_id_is_required()
    {
        $user = User::factory()->create();

        $claimData = [
            'claim_number' => 'CLM-2024-TEST',
            'user_id' => $user->id,
            'claim_type' => 'Death',
            'claim_date' => '2024-01-15',
            'claim_amount' => 50000000,
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertSessionHasErrors('policy_id');
    }

    /** @test */
    public function test_user_id_is_required()
    {
        $policy = Policy::factory()->create();

        $claimData = [
            'claim_number' => 'CLM-2024-TEST',
            'policy_id' => $policy->id,
            'claim_type' => 'Death',
            'claim_date' => '2024-01-15',
            'claim_amount' => 50000000,
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertSessionHasErrors('user_id');
    }

    /** @test */
    public function test_claim_type_is_required()
    {
        $policy = Policy::factory()->create();
        $user = User::factory()->create();

        $claimData = [
            'claim_number' => 'CLM-2024-TEST',
            'policy_id' => $policy->id,
            'user_id' => $user->id,
            'claim_date' => '2024-01-15',
            'claim_amount' => 50000000,
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertSessionHasErrors('claim_type');
    }

    /** @test */
    public function test_claim_date_is_required()
    {
        $policy = Policy::factory()->create();
        $user = User::factory()->create();

        $claimData = [
            'claim_number' => 'CLM-2024-TEST',
            'policy_id' => $policy->id,
            'user_id' => $user->id,
            'claim_type' => 'Death',
            'claim_amount' => 50000000,
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertSessionHasErrors('claim_date');
    }

    /** @test */
    public function test_claim_amount_is_required()
    {
        $policy = Policy::factory()->create();
        $user = User::factory()->create();

        $claimData = [
            'claim_number' => 'CLM-2024-TEST',
            'policy_id' => $policy->id,
            'user_id' => $user->id,
            'claim_type' => 'Death',
            'claim_date' => '2024-01-15',
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertSessionHasErrors('claim_amount');
    }

    /** @test */
    public function test_claim_number_must_be_unique()
    {
        $existingClaim = Claim::factory()->create(['claim_number' => 'CLM-2024-DUPLICATE']);
        
        $policy = Policy::factory()->create();
        $user = User::factory()->create();

        $claimData = [
            'claim_number' => 'CLM-2024-DUPLICATE',
            'policy_id' => $policy->id,
            'user_id' => $user->id,
            'claim_type' => 'Death',
            'claim_date' => '2024-01-15',
            'claim_amount' => 50000000,
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertSessionHasErrors('claim_number');
    }

    /** @test */
    public function test_policy_id_must_exist_in_cases_table()
    {
        $user = User::factory()->create();

        $claimData = [
            'claim_number' => 'CLM-2024-TEST',
            'policy_id' => 99999, // Non-existent policy
            'user_id' => $user->id,
            'claim_type' => 'Death',
            'claim_date' => '2024-01-15',
            'claim_amount' => 50000000,
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertSessionHasErrors('policy_id');
    }

    /** @test */
    public function test_user_id_must_exist_in_users_table()
    {
        $policy = Policy::factory()->create();

        $claimData = [
            'claim_number' => 'CLM-2024-TEST',
            'policy_id' => $policy->id,
            'user_id' => 99999, // Non-existent user
            'claim_type' => 'Death',
            'claim_date' => '2024-01-15',
            'claim_amount' => 50000000,
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertSessionHasErrors('user_id');
    }

    /** @test */
    public function test_claim_amount_must_be_numeric()
    {
        $policy = Policy::factory()->create();
        $user = User::factory()->create();

        $claimData = [
            'claim_number' => 'CLM-2024-TEST',
            'policy_id' => $policy->id,
            'user_id' => $user->id,
            'claim_type' => 'Death',
            'claim_date' => '2024-01-15',
            'claim_amount' => 'not-a-number',
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertSessionHasErrors('claim_amount');
    }

    /** @test */
    public function test_claim_amount_must_be_greater_than_or_equal_to_zero()
    {
        $policy = Policy::factory()->create();
        $user = User::factory()->create();

        $claimData = [
            'claim_number' => 'CLM-2024-TEST',
            'policy_id' => $policy->id,
            'user_id' => $user->id,
            'claim_type' => 'Death',
            'claim_date' => '2024-01-15',
            'claim_amount' => -1000,
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertSessionHasErrors('claim_amount');
    }

    /** @test */
    public function test_status_must_be_in_allowed_values()
    {
        $policy = Policy::factory()->create();
        $user = User::factory()->create();

        $claimData = [
            'claim_number' => 'CLM-2024-TEST',
            'policy_id' => $policy->id,
            'user_id' => $user->id,
            'claim_type' => 'Death',
            'claim_date' => '2024-01-15',
            'claim_amount' => 50000000,
            'status' => 'invalid-status',
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertSessionHasErrors('status');
    }

    /** @test */
    public function test_successful_creation_redirects_with_success_message()
    {
        $policy = Policy::factory()->create();
        $user = User::factory()->create();

        $claimData = [
            'claim_number' => 'CLM-2024-TEST',
            'policy_id' => $policy->id,
            'user_id' => $user->id,
            'claim_type' => 'Death',
            'claim_date' => '2024-01-15',
            'claim_amount' => 50000000,
        ];

        $response = $this->actingAs($this->user)
            ->post(route('sales.claim.store'), $claimData);

        $response->assertRedirect(route('sales.claim.index'));
        $response->assertSessionHas('message', 'Klaim Berhasil Disimpan!');
    }

    // ==================== SHOW METHOD TESTS ====================

    /** @test */
    public function test_viewing_specific_claim_with_relationships_loaded()
    {
        $claim = Claim::factory()->create();

        $response = $this->actingAs($this->user)
            ->get(route('sales.claim.show', $claim->id));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('claim/show')
                ->has('claim')
                ->has('claim.policy')
                ->has('claim.policy.holder')
                ->has('claim.policy.insured')
                ->has('claim.policy.agent')
                ->has('claim.policy.product')
                ->has('claim.user')
        );
    }

    /** @test */
    public function test_404_for_non_existent_claim()
    {
        $response = $this->actingAs($this->user)
            ->get(route('sales.claim.show', 99999));

        $response->assertStatus(404);
    }
    
    // ==================== ADDITIONAL EDGE CASE TESTS ====================

    /** @test */
    public function test_claims_are_ordered_by_id_descending()
    {
        $claim1 = Claim::factory()->create();
        $claim2 = Claim::factory()->create();
        $claim3 = Claim::factory()->create();

        $response = $this->actingAs($this->user)
            ->get(route('sales.claim.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('claim/index')
                ->where('claims.data.0.id', $claim3->id)
                ->where('claims.data.1.id', $claim2->id)
                ->where('claims.data.2.id', $claim1->id)
        );
    }

    /** @test */
    public function test_claims_are_paginated_with_10_items_per_page()
    {
        Claim::factory()->count(15)->create();

        $response = $this->actingAs($this->user)
            ->get(route('sales.claim.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('claim/index')
                ->has('claims.data', 10)
                ->where('claims.per_page', 10)
        );
    }

    /** @test */
    public function test_multiple_filters_can_be_applied_simultaneously()
    {
        $policy = Policy::factory()->create(['policy_no' => 'POL-MULTI']);
        Claim::factory()->create([
            'policy_id' => $policy->id,
            'status' => 'pending',
            'claim_type' => 'Death',
        ]);
        Claim::factory()->create([
            'status' => 'approved',
            'claim_type' => 'Death',
        ]);
        Claim::factory()->create([
            'status' => 'pending',
            'claim_type' => 'Medical',
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('sales.claim.index', [
                'q' => 'POL-MULTI',
                'status' => 'pending',
                'claim_type' => 'Death',
            ]));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('claim/index')
                ->has('claims.data', 1)
                ->where('filters.q', 'POL-MULTI')
                ->where('filters.status', 'pending')
                ->where('filters.claim_type', 'Death')
        );
    }
}

// Made with Bob
