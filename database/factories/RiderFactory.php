<?php

namespace Database\Factories;

use App\Models\Policy;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rider>
 */
class RiderFactory extends Factory
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
            'product_id' => Product::factory(),
            'insure_amount' => $this->faker->numberBetween(10000000, 100000000),
            'premium' => $this->faker->numberBetween(100000, 1000000),
            'insure_period' => $this->faker->numberBetween(5, 20),
            'pay_period' => $this->faker->numberBetween(5, 20),
            'add_date' => $this->faker->optional()->date(),
        ];
    }
}
