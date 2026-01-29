<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_birthday_report_can_be_rendered()
    {
        $response = $this->actingAs($this->user)->get(route('reports.birthday', ['month' => 1]));
        $response->assertOk();
    }

    public function test_production_report_can_be_rendered()
    {
        $response = $this->actingAs($this->user)->get(route('reports.production', ['year' => 2024]));
        $response->assertOk();
    }

    public function test_monthly_report_can_be_rendered()
    {
        $response = $this->actingAs($this->user)->get(route('reports.monthly', ['report_month' => '2024-01']));
        $response->assertOk();
    }

    public function test_mdrt_report_can_be_rendered()
    {
        $response = $this->actingAs($this->user)->get(route('reports.mdrt', ['year' => 2024]));
        $response->assertOk();
    }
}
