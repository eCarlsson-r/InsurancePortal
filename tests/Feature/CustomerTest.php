<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_customer_index_page_can_be_rendered()
    {
        $response = $this->actingAs($this->user)->get(route('master.customer.index'));

        $response->assertOk();
    }

    public function test_customer_can_be_created()
    {
        $customerData = Customer::factory()->make()->toArray();

        $response = $this->actingAs($this->user)->post(route('master.customer.store'), $customerData);

        $response->assertRedirect(route('master.customer.index'));
        $this->assertDatabaseHas('customers', [
            'name' => $customerData['name'],
            'identity' => $customerData['identity'],
        ]);
    }

    public function test_customer_can_be_updated()
    {
        $customer = Customer::factory()->create();
        $updatedData = Customer::factory()->make()->toArray();

        $response = $this->actingAs($this->user)->put(route('master.customer.update', $customer), $updatedData);

        $response->assertRedirect(route('master.customer.index'));
        $this->assertDatabaseHas('customers', [
            'id' => $customer->id,
            'name' => $updatedData['name'],
        ]);
    }

    public function test_customer_can_be_deleted()
    {
        $customer = Customer::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('master.customer.destroy', $customer));

        $response->assertRedirect();
        $this->assertDatabaseMissing('customers', [
            'id' => $customer->id,
        ]);
    }

    public function test_customer_search_works()
    {
        Customer::factory()->create(['name' => 'John Doe']);
        Customer::factory()->create(['name' => 'Jane Smith']);

        $response = $this->actingAs($this->user)->get(route('master.customer.index', ['search' => 'John']));

        $response->assertOk();
        $response->assertSee('John Doe');
        $response->assertDontSee('Jane Smith');
    }
}
