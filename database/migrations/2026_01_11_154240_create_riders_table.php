<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('riders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_id')->constrained('cases')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnUpdate()->cascadeOnDelete();
            $table->unsignedInteger('insure_amount');
            $table->unsignedInteger('premium');
            $table->unsignedTinyInteger('insure_period');
            $table->unsignedTinyInteger('pay_period');
            $table->date('add_date')->nullable();
            $table->timestamps();

            $table->index(['case_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riders');
    }
};
