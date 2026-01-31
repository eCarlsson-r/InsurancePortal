<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Fund>
 */
class FundFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->bothify('F###'),
            'name' => $this->faker->words(3, true),
            'currency' => $this->faker->numberBetween(1, 3), // Assuming 1=IDR, 2=USD, etc.
        ];
    }
}
