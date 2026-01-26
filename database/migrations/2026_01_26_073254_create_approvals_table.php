<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('approvals', function (Blueprint $table) {
            $table->id();
            // Relasi ke transaksi (untuk barang rusak/hilang/distribusi)
            $table->foreignId('transaction_id')->nullable()->constrained()->onDelete('cascade');
            // Relasi ke produk (untuk pendaftaran produk baru)
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('cascade');
            
            // Siapa yang mengajukan dan siapa yang menyetujui
            $table->foreignId('requester_id')->constrained('users');
            $table->foreignId('approver_id')->nullable()->constrained('users');
            
            $table->enum('status', ['waiting', 'approved', 'rejected'])->default('waiting');
            $table->text('notes')->nullable(); // Alasan penolakan jika status 'rejected'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approvals');
    }
};
