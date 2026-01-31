<?php

namespace Database\Factories;

use App\Models\Agent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Receipt>
 */
class ReceiptFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'policy_no' => $this->faker->bothify('P#######'),
            'agent_id' => Agent::factory(),
            'premium' => $this->faker->numberBetween(100000, 10000000),
            'curr_rate' => $this->faker->randomFloat(4, 1, 1),
            'pay_method' => $this->faker->numberBetween(1, 4),
            'pay_date' => $this->faker->date(),
            'paid_date' => $this->faker->date(),
            'paid_amount' => $this->faker->numberBetween(100000, 10000000),
            'description' => $this->faker->sentence(),
        ];
    }
}
