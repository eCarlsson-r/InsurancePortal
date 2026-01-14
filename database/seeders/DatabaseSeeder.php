<?php

namespace Database\Seeders;

use App\Models\Agency;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Agency::firstOrCreate(
            [
                'name' => 'Rich Kingdom',
                'city' => 'Medan',
                'director' => 'Carissa Louise',
                'leader' => 0,
            ],
            [
                'name' => 'Rich Kingdom 1',
                'city' => 'Medan',
                'director' => 'Andrian Hartanto',
                'leader' => 0
            ],
            [
                'name' => 'Rich Kingdom 2',
                'city' => 'Medan',
                'director' => 'Silvia Kosumo',
                'leader' => 1
            ]
        );
    }
}
