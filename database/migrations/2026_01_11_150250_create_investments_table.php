<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_id')->constrained('cases')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('fund_id')->constrained('funds')->cascadeOnUpdate()->cascadeOnDelete();
            $table->unsignedTinyInteger('allocation');
            $table->timestamps();

            $table->index(['case_id', 'fund_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investments');
    }
};
