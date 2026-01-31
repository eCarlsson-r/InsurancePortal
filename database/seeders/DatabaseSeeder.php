<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Agent;
use App\Models\AgentProgram;
use App\Models\Contest;
use App\Models\Customer;
use App\Models\Fund;
use App\Models\Policy;
use App\Models\Product;
use App\Models\ProductCommission;
use App\Models\ProductCredit;
use App\Models\Program;
use App\Models\ProgramTarget;
use App\Models\Rider;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Users
        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
            ]
        );
        User::factory(10)->create();

        
        // 2. Agencies
        $agencies = Agency::factory(5)->create();

        // 3. Agents
        // We'll create some top-level agents (no recruiter)
        $topAgents = Agent::factory(5)->create([
            'recruiter_id' => null,
            'agency_id' => fn() => $agencies->random()->id,
        ]);

        // And some sub-agents
        $agents = Agent::factory(20)->create([
            'recruiter_id' => fn() => $topAgents->random()->id,
            'agency_id' => fn() => $agencies->random()->id,
        ]);

        $allAgents = $topAgents->merge($agents);

        // 4. Customers
        $customers = Customer::factory(50)->create();

        // 5. Products and related data
        $products = Product::factory(10)->create();
        foreach ($products as $product) {
            ProductCommission::factory(5)->create(['product_id' => $product->id]);
            ProductCredit::factory(1)->create(['product_id' => $product->id]);
        }
        $funds = Fund::factory(5)->create();

        // 6. Contests
        Contest::factory(5)->create();

        // 7. Policies (Cases) and related data
        $policies = Policy::factory(100)->create([
            'agent_id' => fn() => $allAgents->random()->id,
            'holder_id' => fn() => $customers->random()->id,
            'insured_id' => fn() => $customers->random()->id,
            'product_id' => fn() => $products->random()->id,
        ]);

        foreach ($policies as $policy) {
            // Riders
            Rider::factory(rand(0, 3))->create([
                'case_id' => $policy->id,
                'product_id' => $products->random()->id,
            ]);

            // Investments
            Investment::factory(rand(1, 3))->create([
                'case_id' => $policy->id,
                'fund_id' => $funds->random()->id,
            ]);

            // Receipts
            Receipt::factory(rand(1, 5))->create([
                'agent_id' => $policy->agent_id,
                'policy_no' => $policy->policy_no,
                'premium' => $policy->premium,
            ]);
        }

        // 8. Programs
        $programs = Program::factory(3)->create();
        foreach ($programs as $program) {
            ProgramTarget::factory(12)->create([
                'program_id' => $program->id,
                'month' => fn($attributes, $model) => ($model->id % 12) + 1,
            ]);
        }

        // Agent Programs
        foreach ($allAgents as $agent) {
            if (rand(0, 1)) {
                AgentProgram::factory()->create([
                    'agent_id' => $agent->id,
                    'program_id' => $programs->random()->id,
                    'agent_leader_id' => $topAgents->random()->id,
                ]);
            }
        }

        // 9. Files
        File::factory(50)->create([
            'purpose' => 'case',
            'document_id' => fn() => $policies->random()->id,
        ]);
        File::factory(20)->create([
            'purpose' => 'agent',
            'document_id' => fn() => $allAgents->random()->id,
        ]);
    }
}
