<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('official_number');
            $table->date('apply_date')->nullable();
            $table->string('apply_place', 200);
            $table->unsignedBigInteger('agency_id');
            $table->string('name', 500);
            $table->unsignedTinyInteger('gender');
            $table->string('birth_place', 100);
            $table->date('birth_date');
            $table->string('address', 1000);
            $table->string('religion', 200);
            $table->string('identity_number', 20);
            $table->string('tax_number', 20);
            $table->string('city', 100);
            $table->string('province', 100);
            $table->string('postal_code', 10);
            $table->string('education', 100);
            $table->string('phone', 20)->nullable();
            $table->string('mobile', 20)->nullable();
            $table->string('email', 500);
            $table->unsignedTinyInteger('status')->default(0);
            $table->string('spouse', 1000);
            $table->string('occupation', 200);
            $table->unsignedTinyInteger('dependents')->default(0);
            $table->string('license', 100)->nullable();
            $table->date('due_date')->nullable();
            $table->unsignedBigInteger('recruiter_id');
            $table->string('notes', 1000);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agents');
    }
};
