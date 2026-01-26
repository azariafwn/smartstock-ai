<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\Auth\LoginController;

// Pastikan urutan rute ini benar
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'authenticate']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [ProductController::class, 'dashboard']);

    Route::get('/inventory', [ProductController::class, 'inventory'])->name('inventory.index');
    Route::post('/inventory', [ProductController::class, 'store'])->name('inventory.store');
    Route::put('/inventory/{id}', [ProductController::class, 'update'])->name('inventory.update');
    Route::delete('/inventory/{id}', [ProductController::class, 'destroy'])->name('inventory.destroy');

    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');

    Route::get('/approvals', [TransactionController::class, 'approvals'])->name('approvals.index');
    Route::put('/approvals/{id}', [TransactionController::class, 'updateApproval'])->name('approvals.update');

    Route::get('/reports', [TransactionController::class, 'reports'])->name('reports.index');
});

Route::get('/', function () { 
    return redirect('/dashboard'); 
});