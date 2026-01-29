<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'gender' => $this->faker->randomElement([1, 2]),
            'identity' => $this->faker->unique()->numerify('################'),
            'mobile' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'birth_date' => $this->faker->date(),
            'birth_place' => $this->faker->city,
            'religion' => $this->faker->randomElement([1, 2, 3, 4, 5, 6]),
            'marital' => $this->faker->randomElement([1, 2, 3, 4]),
            'profession' => $this->faker->jobTitle,
            'home_address' => $this->faker->address,
            'home_postal' => $this->faker->postcode,
            'home_city' => $this->faker->city,
            'work_address' => $this->faker->address,
            'work_postal' => $this->faker->postcode,
            'work_city' => $this->faker->city,
            'description' => $this->faker->sentence,
        ];
    }
}
