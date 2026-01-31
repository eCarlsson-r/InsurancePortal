<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Program>
 */
class ProgramFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'position' => $this->faker->randomElement(['FC', 'UM', 'BM']),
            'min_allowance' => $this->faker->numberBetween(1000000, 5000000),
            'max_allowance' => $this->faker->numberBetween(6000000, 15000000),
            'duration' => $this->faker->numberBetween(12, 36),
            'direct_calculation' => $this->faker->numberBetween(1, 100),
            'indirect_calculation' => $this->faker->numberBetween(1, 50),
        ];
    }
}
