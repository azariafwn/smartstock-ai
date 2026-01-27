<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Exports\ProductsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class InventoryController extends Controller
{
    // ... method index, store, update, destroy tetap sama ...

    public function export(Request $request)
    {
        $query = Product::with('category');

        // Filter Kategori
        if ($request->category && $request->category !== 'all') {
            $query->where('category_id', $request->category);
        }

        // Filter Search
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }

        // Filter Stok Kritis
        if ($request->critical === '1') {
            // COMMENT: Sesuaikan nama kolom 'stock' dan 'threshold' (atau min_threshold)
            $query->whereColumn('stock', '<=', 'threshold');
        }

        $products = $query->get();

        if ($request->format === 'excel') {
            return Excel::download(new ProductsExport($products), 'inventory_report.xlsx');
        } 
        
        if ($request->format === 'pdf') {
            $pdf = Pdf::loadView('pdf.inventory', compact('products'));
            return $pdf->download('inventory_report.pdf');
        }
    }
}