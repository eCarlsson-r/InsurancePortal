<?php

namespace Database\Factories;

use App\Models\Program;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProgramTarget>
 */
class ProgramTargetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'program_id' => Program::factory(),
            'allowance' => $this->faker->numberBetween(1000000, 10000000),
            'month' => $this->faker->numberBetween(1, 12),
            'case_month' => $this->faker->numberBetween(1, 10),
            'fyp_month' => $this->faker->numberBetween(5000000, 50000000),
        ];
    }
}
