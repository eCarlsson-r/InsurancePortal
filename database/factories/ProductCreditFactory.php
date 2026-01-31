<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductCredit>
 */
class ProductCreditFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'production_credit' => $this->faker->numberBetween(10, 100),
            'contest_credit' => $this->faker->numberBetween(10, 100),
            'credit_start' => $this->faker->date(),
            'credit_end' => $this->faker->optional()->date(),
        ];
    }
}
