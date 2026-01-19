<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string('name', 500);
            $table->string('type', 100);
            $table->string('extension', 100);
            $table->unsignedInteger('size');
            $table->date('upload_date');
            $table->string('purpose', 100);
            $table->string('document_id', 20);

            $table->unique(['name', 'type', 'extension', 'size'], 'unique_file');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
