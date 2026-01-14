<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agent_programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_id')
                ->constrained('agents')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId('program_id')
                ->nullable()
                ->constrained('programs')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->string('position', 6);
            $table->date('program_start');
            $table->date('program_end')->nullable();
            $table->foreignId('agent_leader_id')
                ->nullable()
                ->constrained('agents')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->unsignedInteger('allowance');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agent_programs');
    }
};
