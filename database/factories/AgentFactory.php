<?php

namespace Database\Factories;

use App\Models\Agent;
use App\Models\Agency;
use Illuminate\Database\Eloquent\Factories\Factory;

class AgentFactory extends Factory
{
    protected $model = Agent::class;

    public function definition(): array
    {
        return [
            'official_number' => $this->faker->unique()->numberBetween(100000, 999999),
            'apply_date' => $this->faker->date(),
            'apply_place' => $this->faker->city,
            'agency_id' => Agency::factory(),
            'name' => $this->faker->name,
            'gender' => $this->faker->randomElement([1, 2]),
            'birth_place' => $this->faker->city,
            'birth_date' => $this->faker->date(),
            'address' => $this->faker->address,
            'religion' => $this->faker->word,
            'identity_number' => $this->faker->unique()->numerify('################'),
            'tax_number' => $this->faker->numerify('###############'),
            'city' => $this->faker->city,
            'province' => $this->faker->state,
            'postal_code' => $this->faker->postcode,
            'education' => $this->faker->randomElement(['SMA', 'D3', 'S1', 'S2']),
            'phone' => $this->faker->phoneNumber,
            'mobile' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'status' => 1,
            'spouse' => $this->faker->name,
            'occupation' => $this->faker->jobTitle,
            'dependents' => $this->faker->numberBetween(0, 5),
            'license' => $this->faker->word,
            'due_date' => $this->faker->date(),
            'recruiter_id' => Agent::factory(),
            'notes' => $this->faker->sentence,
        ];
    }
}
