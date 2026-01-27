<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\ReportsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['product', 'user']);

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00', 
                $request->end_date . ' 23:59:59'
            ]);
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        return Inertia::render('Reports', [
            'reports' => $query->latest()->get(),
            'filters' => $request->only(['start_date', 'end_date', 'category'])
        ]);
    }

    public function export(Request $request)
    {
        // Meningkatkan batas memori dan waktu eksekusi agar stabil
        ini_set('memory_limit', '256M');
        ini_set('max_execution_time', '300');

        $query = Transaction::with(['product', 'user']);

        // Terapkan filter yang sama dengan tampilan web
        if ($request->start_date && $request->end_date) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00', 
                $request->end_date . ' 23:59:59'
            ]);
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        $reports = $query->latest()->get();

        if ($request->format === 'excel') {
            return Excel::download(new ReportsExport($reports), 'Audit_Report_' . now()->format('Ymd') . '.xlsx');
        }

        if ($request->format === 'pdf') {
            $pdf = Pdf::loadView('pdf.reports', ['reports' => $reports]);
            
            // Atur ukuran kertas ke A4 Portrait
            $pdf->setPaper('a4', 'portrait'); 

            // CHANGE: Menggunakan download() alih-alih stream() agar file langsung terunduh
            return $pdf->download('Audit_Report_' . now()->format('Ymd') . '.pdf'); 
        }
    }
}