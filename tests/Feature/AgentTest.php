<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Agent;
use App\Models\Agency;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgentTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_agent_index_page_can_be_rendered()
    {
        $response = $this->actingAs($this->user)->get(route('master.agent.index'));

        $response->assertOk();
    }

    public function test_agent_can_be_created()
    {
        $agency = Agency::factory()->create();
        
        $recruiter = Agent::factory()->create([
            'agency_id' => $agency->id,
            'recruiter_id' => 1
        ]);

        $agentData = Agent::factory()->make([
            'agency_id' => $agency->id,
            'recruiter_id' => $recruiter->id
        ])->toArray();

        $response = $this->actingAs($this->user)->post(route('master.agent.store'), $agentData);

        $response->assertRedirect(route('master.agent.index'));
        $this->assertDatabaseHas('agents', [
            'name' => $agentData['name'],
            'official_number' => $agentData['official_number'],
        ]);
    }

    public function test_agent_can_be_updated()
    {
        $agent = Agent::factory()->create([
            'recruiter_id' => 1,
            'agency_id' => 1
        ]);
        
        $updatedData = [
            'apply_date' => now()->format('Y-m-d'),
            'apply_place' => 'New Place',
            'agency_id' => $agent->agency_id,
            'gender' => 1,
            'birth_place' => 'New Birth Place',
            'birth_date' => '1990-01-01',
            'address' => 'New Address',
            'city' => 'New City',
            'province' => 'New Province',
            'postal_code' => '12345',
            'education' => 'S1',
            'phone' => '021123456',
            'mobile' => '0812345678',
            'email' => 'new@email.com',
            'status' => 1,
            'spouse' => 'New Spouse',
            'occupation' => 'New Job',
            'dependents' => 2,
            'notes' => 'New Notes',
        ];

        $response = $this->actingAs($this->user)->put(route('master.agent.update', $agent->id), $updatedData);

        $response->assertRedirect(route('master.agent.index'));
        $this->assertDatabaseHas('agents', [
            'id' => $agent->id,
            'apply_place' => 'New Place',
            'email' => 'new@email.com',
        ]);
    }

    public function test_agent_can_be_deleted()
    {
        $agent = Agent::factory()->create([
            'recruiter_id' => 1,
            'agency_id' => 1
        ]);

        $response = $this->actingAs($this->user)->delete(route('master.agent.destroy', $agent));

        $response->assertRedirect();
        $this->assertDatabaseMissing('agents', [
            'id' => $agent->id,
        ]);
    }
}
