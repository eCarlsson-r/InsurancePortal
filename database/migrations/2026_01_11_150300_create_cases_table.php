<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cases', function (Blueprint $table) {
            $table->id();
            $table->string('policy_no', 20);
            $table->foreignId('holder_id')->constrained('customers')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('insured_id')->constrained('customers')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('agent_id')->constrained('agents')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('holder_insured_relationship', 50)->default('');
            $table->date('entry_date');
            $table->unsignedInteger('case_tagih');
            $table->boolean('is_insure_holder');
            $table->foreignId('product_id')->constrained('products')->cascadeOnUpdate()->cascadeOnDelete();
            $table->unsignedInteger('insure_period');
            $table->unsignedInteger('pay_period');
            $table->unsignedInteger('currency_id');
            $table->decimal('curr_rate', 11, 4);
            $table->date('start_date');
            $table->unsignedBigInteger('base_insure');
            $table->unsignedInteger('premium');
            $table->unsignedInteger('pay_method');
            $table->text('description');
            $table->foreignId('subagent_id')->constrained('subagents')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
};
