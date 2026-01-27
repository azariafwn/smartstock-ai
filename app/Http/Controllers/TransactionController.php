<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Approval;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index()
    {
        return \Inertia\Inertia::render('Transactions/Index', [
            'products' => \App\Models\Product::all(['id', 'name', 'stock']),
            // Menampilkan histori transaksi user yang sedang login
            'transactions' => \App\Models\Transaction::with('product')
                ->where('user_id', auth()->id())
                ->latest()
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:IN,OUT',
            'category' => 'required|in:sale,distributed,damaged,lost,restock',
            'quantity' => 'required|integer|min:1',
        ]);

        \DB::transaction(function () use ($request) {
            $transaction = \App\Models\Transaction::create([
                'product_id' => $request->product_id,
                'user_id' => auth()->id(),
                'type' => $request->type,
                'category' => $request->category,
                'quantity' => $request->quantity,
                'status' => 'pending', 
            ]);

            \App\Models\Approval::create([
                'transaction_id' => $transaction->id,
                'requester_id' => auth()->id(),
                'status' => 'waiting',
            ]);
        });

        // UPDATE: Redirect back dengan flash message (English UI)
        return redirect()->back()->with('message', 'Transaction submitted successfully and waiting for approval.');
    }   

    public function approvals()
    {
        // Mengambil data approval yang statusnya masih 'waiting'
        return \Inertia\Inertia::render('Transactions/Approvals', [
            'approvals' => \App\Models\Approval::with(['transaction.product', 'transaction.user'])
                ->where('status', 'waiting')
                ->latest()
                ->get()
        ]);
    }

    public function updateApproval(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'notes' => 'nullable|string'
        ]);

        \DB::transaction(function () use ($request, $id) {
            $approval = \App\Models\Approval::findOrFail($id);
            $transaction = $approval->transaction;
            $product = $transaction->product;

            // 1. Update status di tabel approvals
            $approval->update([
                'status' => $request->status,
                'approver_id' => auth()->id(),
                'notes' => $request->notes,
            ]);

            // 2. Update status di tabel transactions
            $transaction->update(['status' => $request->status]);

            // 3. JIKA APPROVED: Update stok di tabel products
            if ($request->status === 'approved') {
                if ($transaction->type === 'IN') {
                    $product->increment('stock', $transaction->quantity);
                } else {
                    $product->decrement('stock', $transaction->quantity);
                }
            }
        });

        return redirect()->back()->with('message', 'Approval status updated successfully.');
    }

    public function reports(Request $request)
    {
        // Ambil filter dari request
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $category = $request->input('category');

        // Query transaksi dengan filter dinamis
        $query = \App\Models\Transaction::with(['product', 'user'])
            ->where('status', 'approved'); // Hanya tampilkan yang sudah disetujui

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }
        if ($category) {
            $query->where('category', $category);
        }

        return \Inertia\Inertia::render('Reports/Index', [
            'reports' => $query->latest()->get(),
            'filters' => $request->only(['start_date', 'end_date', 'category'])
        ]);
    }

    public function export(Request $request) 
    {
        $query = Transaction::with(['product', 'user']);
        
        // Filter Berdasarkan Type (IN/OUT)
        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }
        
        // PENTING: Harus pakai ->get() untuk merubah query menjadi Collection
        $transactions = $query->latest()->get(); 

        if ($request->format === 'excel') {
            // Gunakan Full Namespace jika belum di-import di atas
            return \Maatwebsite\Excel\Facades\Excel::download(
                new \App\Exports\TransactionsExport($transactions), 
                'Logistics_Report_' . now()->format('Ymd') . '.xlsx'
            );
        }
        
        if ($request->format === 'pdf') {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.transactions', compact('transactions'));
            return $pdf->download('Logistics_Report_' . now()->format('Ymd') . '.pdf');
        }
    }
}