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
            $table->unsignedInteger('rider_insure');
            $table->unsignedInteger('rider_premium');
            $table->unsignedTinyInteger('rider_insure_period');
            $table->unsignedTinyInteger('rider_pay_period');
            $table->date('rider_add_date')->nullable();
            $table->timestamps();

            $table->index(['case_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riders');
    }
};
