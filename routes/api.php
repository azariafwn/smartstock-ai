<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes - SmartStock AI
|--------------------------------------------------------------------------
*/

// 1. Public Route: Akses tanpa login 
Route::post('/login', [AuthController::class, 'login']);

// 2. Protected Routes: Harus login (Sanctum) [cite: 3, 8]
Route::middleware('auth:sanctum')->group(function () {
    
    // Khusus Superadmin: Approval & User Management [cite: 22, 25]
    Route::middleware('role:superadmin')->group(function () {
        Route::get('/approvals', [ApprovalController::class, 'index']); // List pengajuan [cite: 25]
        Route::patch('/approvals/{id}', [ApprovalController::class, 'update']); // Approve/Reject 
        Route::get('/approvals/history', [ApprovalController::class, 'history']); // Log audit [cite: 25]
    });

    // Admin & Superadmin: Master Data & User Management [cite: 25]
    Route::middleware('role:admin,superadmin')->group(function () {
        Route::apiResource('/products', ProductController::class); // CRUD Produk [cite: 25]
        Route::apiResource('/users', UserController::class); // CRUD Staff [cite: 22]
    });

    // Semua Role: View Inventory & Transactions 
    Route::get('/products', [ProductController::class, 'index']); 
    Route::post('/transactions', [TransactionController::class, 'store']); // Input barang keluar (Staff) 
    Route::get('/transactions/my-report', [TransactionController::class, 'myReport']); // Report Staff 
    Route::get('/dashboard/stats', [ProductController::class, 'dashboard']);

    // Mock FastAPI Endpoint
    Route::post('/mock-ai/predict', function () {
        return response()->json([
            'product_id' => request('product_id'),
            'predictions' => [
                ['date' => now()->addDays(1)->format('Y-m-d'), 'quantity' => 15],
                ['date' => now()->addDays(2)->format('Y-m-d'), 'quantity' => 12],
                ['date' => now()->addDays(7)->format('Y-m-d'), 'quantity' => 20],
            ]
        ]);
    });

    Route::get('/ai/forecast/{product_id}', [ProductController::class, 'getForecastData']);
});