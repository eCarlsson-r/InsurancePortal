<?php

namespace Database\Factories;

use App\Models\Agent;
use App\Models\Program;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AgentProgram>
 */
class AgentProgramFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'agent_id' => Agent::factory(),
            'program_id' => Program::factory(),
            'position' => $this->faker->randomElement(['FC', 'UM', 'BM']),
            'program_start' => $this->faker->date(),
            'program_end' => $this->faker->optional()->date(),
            'agent_leader_id' => null,
            'allowance' => $this->faker->numberBetween(1000000, 10000000),
        ];
    }
}
