<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductCommission>
 */
class ProductCommissionFactory extends Factory
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
            'payment_method' => $this->faker->numberBetween(1, 4),
            'currency' => $this->faker->numberBetween(1, 2),
            'year' => $this->faker->numberBetween(1, 5),
            'payment_period' => $this->faker->optional()->numberBetween(1, 12),
            'commission_rate' => $this->faker->randomFloat(2, 0, 50),
            'extra_commission' => $this->faker->numberBetween(0, 1000),
        ];
    }
}
