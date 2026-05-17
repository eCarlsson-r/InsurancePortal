<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('claims', function (Blueprint $table) {
            $table->id();
            $table->string('claim_number', 50)->unique();
            $table->foreignId('policy_id')->constrained('cases')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('claim_type', 50); // e.g., 'death', 'maturity', 'surrender', 'disability', etc.
            $table->date('claim_date');
            $table->date('incident_date')->nullable();
            $table->decimal('claim_amount', 15, 2);
            $table->string('status', 20)->default('pending'); // pending, approved, rejected, paid
            $table->text('description')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->date('approved_at')->nullable();
            $table->date('paid_at')->nullable();
            $table->decimal('approved_amount', 15, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};

// Made with Bob
