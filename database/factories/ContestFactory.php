<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contest>
 */
class ContestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'type' => $this->faker->randomElement(['Quarterly', 'Yearly', 'Flash']),
            'start' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'end' => $this->faker->dateTimeBetween('now', '+3 months'),
            'product' => $this->faker->word(),
            'level' => $this->faker->randomElement(['FC', 'UM', 'BM', 'AVP']),
            'minimum_commision' => $this->faker->numberBetween(1000000, 10000000),
            'minimum_premium' => $this->faker->numberBetween(5000000, 50000000),
            'minimum_policy' => $this->faker->numberBetween(1, 10),
            'bonus_percent' => $this->faker->numberBetween(0, 50),
            'bonus_amount' => $this->faker->numberBetween(0, 5000000),
            'reward' => $this->faker->randomElement(['Trip to Japan', 'MacBook Pro', 'Cash Bonus', 'Gold Bar']),
        ];
    }
}
