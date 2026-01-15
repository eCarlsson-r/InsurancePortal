<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->string('policy_no', 20);
            $table->foreignId('agent_id')->constrained('agents')->cascadeOnUpdate()->cascadeOnDelete();
            $table->unsignedInteger('premium');
            $table->decimal('curr_rate', 11, 4);
            $table->unsignedInteger('pay_method');
            $table->date('pay_date');
            $table->date('paid_date');
            $table->unsignedInteger('paid_amount');
            $table->string('description', 1000);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipts');
    }
};
