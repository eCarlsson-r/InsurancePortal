<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_credits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnUpdate()->cascadeOnDelete();
            $table->unsignedTinyInteger('production_credit');
            $table->unsignedTinyInteger('contest_credit');
            $table->date('credit_start');
            $table->date('credit_end')->nullable();
            $table->timestamps();

            $table->index(['product_id', 'credit_start']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_credits');
    }
};
