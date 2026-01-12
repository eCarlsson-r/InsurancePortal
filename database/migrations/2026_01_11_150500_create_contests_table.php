<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contests', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200)->default('');
            $table->string('type', 50)->default('');
            $table->date('start');
            $table->date('end');
            $table->string('product', 500)->default('');
            $table->string('level', 10)->default('FC');
            $table->unsignedInteger('minimum_commision');
            $table->unsignedBigInteger('minimum_premium');
            $table->unsignedInteger('minimum_policy');
            $table->unsignedSmallInteger('bonus_percent');
            $table->unsignedInteger('bonus_amount');
            $table->string('reward', 100)->default('');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contests');
    }
};
