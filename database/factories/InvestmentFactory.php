<?php

namespace Database\Factories;

use App\Models\Policy;
use App\Models\Fund;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Investment>
 */
class InvestmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'case_id' => Policy::factory(),
            'fund_id' => Fund::factory(),
            'allocation' => $this->faker->numberBetween(10, 100),
        ];
    }
}
