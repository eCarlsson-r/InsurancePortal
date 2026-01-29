<?php

namespace Database\Factories;

use App\Models\Policy;
use App\Models\Customer;
use App\Models\Agent;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class PolicyFactory extends Factory
{
    protected $model = Policy::class;

    public function definition(): array
    {
        return [
            'policy_no' => $this->faker->unique()->numerify('##########'),
            'holder_id' => Customer::factory(),
            'insured_id' => Customer::factory(),
            'agent_id' => Agent::factory(),
            'holder_insured_relationship' => 'Self',
            'entry_date' => $this->faker->date(),
            'bill_at' => $this->faker->numberBetween(1, 31),
            'is_insure_holder' => true,
            'product_id' => Product::factory(),
            'insure_period' => 20,
            'pay_period' => 10,
            'currency_id' => 1,
            'curr_rate' => 1.0,
            'start_date' => $this->faker->date(),
            'base_insure' => $this->faker->numberBetween(10000000, 100000000),
            'premium' => $this->faker->numberBetween(500000, 5000000),
            'pay_method' => 1,
            'description' => $this->faker->sentence,
        ];
    }
}
