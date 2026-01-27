<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Cara paling aman: Ubah ke string agar tidak gampang error saat nambah kategori lagi
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('category')->change(); 
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Jika ingin balik ke enum asal (opsional)
            $table->enum('category', ['sale', 'damaged', 'distributed', 'lost'])->change();
        });
    }
};