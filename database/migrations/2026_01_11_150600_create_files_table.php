<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->increments('file_id');
            $table->string('file_name', 500);
            $table->string('file_type', 100);
            $table->string('file_ext', 100);
            $table->unsignedInteger('file_size');
            $table->date('file_upload_date');
            $table->string('file_purpose', 100);
            $table->string('file_document_id', 20);

            $table->unique(['file_name', 'file_type', 'file_ext', 'file_size'], 'unique_file');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
