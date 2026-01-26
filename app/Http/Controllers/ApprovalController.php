<?php

namespace App\Http\Controllers;

use App\Models\Approval;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Services\AIService;
use Illuminate\Support\Facades\DB;

class ApprovalController extends Controller
{
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'notes' => 'required_if:status,rejected' 
        ]);

        return DB::transaction(function () use ($request, $id) {
            $approval = Approval::findOrFail($id);
            $transaction = Transaction::findOrFail($approval->transaction_id);
            $product = Product::findOrFail($transaction->product_id);

            if ($request->status === 'approved') {
                // 1. Update status transaksi menjadi approved 
                $transaction->update(['status' => 'approved']);

                // 2. Potong Stok: Hanya jika tipe OUT (Lost/Damaged) 
                if ($transaction->type === 'OUT') {
                    $product->decrement('stock', $transaction->quantity);
                }

                // 3. Pemicu Sinkronisasi AI (Data Aggregator) 
                $aiService = new AIService();
                $aiService->syncForecast($product->id);

            } else {
                // Jika ditolak, data hangus/tidak memotong stok [cite: 22]
                $transaction->update(['status' => 'rejected']);
            }

            // 4. Close Approval Log (Audit Trail) 
            $approval->update([
                'status' => $request->status,
                'approver_id' => auth()->id(), 
                'notes' => $request->notes
            ]);

            return response()->json([
                'message' => "Transaction has been {$request->status}."
            ], 200);
        });
    }

    public function index()
    {
        // Menampilkan list request sesuai API Documentation 
        $approvals = Approval::with(['transaction.product', 'requester'])
            ->where('status', 'waiting')
            ->get();

        return response()->json($approvals);
    }
}