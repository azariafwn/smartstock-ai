<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Hapus constraint lama yang mencekal kata 'restock'
        DB::statement('ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_category_check');

        // 2. Ubah kolom menjadi string biasa agar lebih fleksibel
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('category')->change();
        });
    }

    public function down(): void
    {
        // Jika ingin kembali ke enum asal
        Schema::table('transactions', function (Blueprint $table) {
            $table->enum('category', ['sale', 'damaged', 'distributed', 'lost'])->change();
        });
    }
};