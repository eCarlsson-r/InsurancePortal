<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->unsignedTinyInteger('gender');
            $table->string('identity', 20)->unique();
            $table->string('mobile', 50);
            $table->string('email', 100);
            $table->date('birth_date');
            $table->string('birth_place', 200);
            $table->unsignedTinyInteger('religion');
            $table->unsignedTinyInteger('marital');
            $table->string('profession', 100);
            $table->string('home_address', 1000);
            $table->string('home_postal', 10);
            $table->string('home_city', 100);
            $table->string('work_address', 1000);
            $table->string('work_postal', 10);
            $table->string('work_city', 100);
            $table->string('description', 2000);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
