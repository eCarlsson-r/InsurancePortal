<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\File>
 */
class FileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->uuid() . '.jpg',
            'type' => 'image/jpeg',
            'extension' => 'jpg',
            'size' => $this->faker->numberBetween(1000, 5000000),
            'upload_date' => $this->faker->date(),
            'purpose' => $this->faker->randomElement(['case', 'agent', 'identity']),
            'document_id' => (string) $this->faker->numberBetween(1, 1000),
        ];
    }
}
