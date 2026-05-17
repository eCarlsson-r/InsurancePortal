<?php

namespace Database\Factories;

use App\Models\Claim;
use App\Models\Policy;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClaimFactory extends Factory
{
    protected $model = Claim::class;

    public function definition(): array
    {
        return [
            'claim_number' => $this->faker->unique()->numerify('CLM-####-####'),
            'policy_id' => Policy::factory(),
            'user_id' => User::factory(),
            'claim_type' => $this->faker->randomElement(['Death', 'Maturity', 'Surrender', 'Medical', 'Accident']),
            'claim_date' => $this->faker->date(),
            'incident_date' => $this->faker->date(),
            'claim_amount' => $this->faker->numberBetween(1000000, 50000000),
            'status' => 'pending',
            'description' => $this->faker->sentence(),
        ];
    }

    /**
     * Indicate that the claim is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'approved_at' => null,
            'approved_amount' => null,
            'paid_at' => null,
            'rejection_reason' => null,
        ]);
    }

    /**
     * Indicate that the claim is approved.
     */
    public function approved(): static
    {
        return $this->state(function (array $attributes) {
            $approvedAmount = $this->faker->numberBetween(
                (int)($attributes['claim_amount'] * 0.5),
                $attributes['claim_amount']
            );

            return [
                'status' => 'approved',
                'approved_at' => now(),
                'approved_amount' => $approvedAmount,
                'paid_at' => null,
                'rejection_reason' => null,
            ];
        });
    }

    /**
     * Indicate that the claim is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => $this->faker->sentence(20),
            'approved_at' => null,
            'approved_amount' => null,
            'paid_at' => null,
        ]);
    }

    /**
     * Indicate that the claim is paid.
     */
    public function paid(): static
    {
        return $this->state(function (array $attributes) {
            $approvedAmount = $this->faker->numberBetween(
                (int)($attributes['claim_amount'] * 0.5),
                $attributes['claim_amount']
            );

            return [
                'status' => 'paid',
                'approved_at' => now()->subDays(5),
                'approved_amount' => $approvedAmount,
                'paid_at' => now(),
                'rejection_reason' => null,
            ];
        });
    }
}

// Made with Bob
