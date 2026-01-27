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

    // 2. Inventory (Akses tombol manipulasi dibatasi di Frontend/Controller)
    Route::get('/inventory/export', [InventoryController::class, 'export'])->name('inventory.export');
    Route::get('/inventory', [ProductController::class, 'inventory'])->name('inventory.index');
    Route::post('/inventory', [ProductController::class, 'store'])->name('inventory.store');
    Route::put('/inventory/{id}', [ProductController::class, 'update'])->name('inventory.update');
    Route::delete('/inventory/{id}', [ProductController::class, 'destroy'])->name('inventory.destroy');

    // 3. Transactions (Semua Role Bisa Input)
    Route::get('/transactions/export', [TransactionController::class, 'export'])->name('transactions.export');
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');

    /**
     * 4. Menu Approvals: Hanya Superadmin dan Admin
     * Kita kembalikan ke method 'approvals' sesuai struktur lama kamu
     */
    Route::middleware('role:superadmin,admin')->group(function () {
        Route::get('/approvals', [TransactionController::class, 'approvals'])->name('approvals.index');
        Route::put('/approvals/{id}', [TransactionController::class, 'updateApproval'])->name('approvals.update');
    });

    /**
     * 5. Menu Reports: HANYA Superadmin
     * Kita kembalikan ke method 'reports' di TransactionController sesuai struktur lama
     */
    Route::middleware('role:superadmin')->group(function () {
        Route::get('/reports', [TransactionController::class, 'reports'])->name('reports.index');
        Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');
    });

    Route::middleware(['auth', 'role:superadmin'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});

Route::get('/', function () { 
    return redirect('/dashboard'); 
});