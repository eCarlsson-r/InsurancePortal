<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnUpdate()->cascadeOnDelete();
            $table->unsignedTinyInteger('payment_method');
            $table->unsignedTinyInteger('currency');
            $table->unsignedTinyInteger('year');
            $table->unsignedTinyInteger('payment_period')->nullable();
            $table->decimal('commission_rate', 4, 2);
            $table->unsignedInteger('extra_commission')->default(0);
            $table->timestamps();

            $table->index(['product_id', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_commissions');
    }
};
