<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\LoginController;

// --- Public Routes ---
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'authenticate']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// --- Protected Routes ---
Route::middleware('auth')->group(function () {
    
    // 1. Dashboard (Semua Role Bisa)
    Route::get('/dashboard', [ProductController::class, 'dashboard']);

    // 2. Inventory 
    Route::get('/inventory', [ProductController::class, 'inventory'])->name('inventory.index');
    Route::get('/inventory/export', [InventoryController::class, 'export'])->name('inventory.export');
    
    // 3. Transactions 
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/export', [TransactionController::class, 'export'])->name('transactions.export');

    // 4. Approvals (Superadmin & Admin)
    Route::get('/approvals', [TransactionController::class, 'approvals'])
        ->middleware('role:superadmin,admin')
        ->name('approvals.index');

    // 5. Reports (HANYA Superadmin)
    Route::middleware('role:superadmin')->group(function () {
        Route::get('/reports', [TransactionController::class, 'reports'])->name('reports.index');
        Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
    });

    /**
     * =============================================
     * DEMO PROTECTION LAYER (Gembok Data)
     * Grup ini berisi semua rute yang memanipulasi DB
     * =============================================
     */
    Route::middleware(['prevent.demo'])->group(function () {
        
        // Inventory Actions
        Route::post('/inventory', [ProductController::class, 'store'])->name('inventory.store');
        Route::put('/inventory/{id}', [ProductController::class, 'update'])->name('inventory.update');
        Route::delete('/inventory/{id}', [ProductController::class, 'destroy'])->name('inventory.destroy');

        // Transaction Actions
        Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');

        // Approval Actions
        Route::put('/approvals/{id}', [TransactionController::class, 'updateApproval'])->name('approvals.update');

        // User Management Actions
        Route::middleware('role:superadmin')->group(function () {
            Route::post('/users', [UserController::class, 'store'])->name('users.store');
            Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
            Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        });
    });
});

Route::get('/', function () { 
    return redirect('/dashboard'); 
});