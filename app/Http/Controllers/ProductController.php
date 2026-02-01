<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\Approval;
use App\Models\StockForecast;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ProductController extends Controller
{
    public function dashboard(Request $request)
    {
        // 1. Inisialisasi Produk Terpilih
        $selectedProductId = $request->input('product_id', Product::first()?->id);
        $product = Product::findOrFail($selectedProductId);
        
        // 2. Summary Cards
        $summary = [
            'total_stock' => Product::sum('stock'),
            'low_stock' => Product::whereColumn('stock', '<=', 'min_threshold')->count(),
            'pending_requests' => Approval::where('status', 'waiting')->count(),
            'total_loss' => Transaction::where('status', 'approved')
                ->whereIn('category', ['damaged', 'lost'])
                ->sum('quantity') ?? 0,
        ];

        // 3. Ambil History Transaksi (30 hari terakhir) untuk Chart
        $transactions = Transaction::where('product_id', $selectedProductId)
            ->where('status', 'approved')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->orderBy('created_at', 'desc')
            ->get();

        $chartData = [];
        $currentRunningStock = $product->stock; // Mulai dari stok saat ini

        // Iterasi mundur untuk menghitung saldo stok harian (Actual Data)
        for ($i = 0; $i <= 30; $i++) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            
            $dayTransactions = $transactions->filter(function($t) use ($date) {
                return $t->created_at->format('Y-m-d') === $date;
            });

            $chartData[] = [
                'date' => Carbon::parse($date)->format('d/m'),
                'actual' => $currentRunningStock,
                'prediction' => null,
            ];

            // Inverse calculation untuk melihat stok di hari sebelumnya
            foreach ($dayTransactions as $t) {
                if ($t->type === 'IN') {
                    $currentRunningStock -= $t->quantity;
                } else {
                    $currentRunningStock += $t->quantity;
                }
            }
        }

        $chartData = array_reverse($chartData);

        // 4. INTEGRASI AI VIA VENV
        $aiBriefing = "Neural link established. analyzing patterns...";
        
        try {
            // Sesuaikan path ke venv dan script python
            $pythonPath = base_path('venv\Scripts\python.exe');
            $scriptPath = base_path('python_ai\predict_engine.py');
            
            // Eksekusi command: "path/to/venv/python.exe" "path/to/script.py" product_id
            $command = "\"$pythonPath\" \"$scriptPath\" $selectedProductId 2>&1";
            $output = shell_exec($command);
            
            $aiData = json_decode($output, true);

            if ($aiData && !isset($aiData['error'])) {
                $aiBriefing = $aiData['message'];
                
                // Jika ada data burn rate, kita bisa tambahkan 1 titik prediksi ke chart
                // Di dalam ProductController.php
                if (isset($aiData['days_left']) && $aiData['days_left'] > 0) {
                    $forecastDate = Carbon::now()->addDays($aiData['days_left'])->format('d/m');
                    $chartData[] = [
                        'date' => $forecastDate, // Menggunakan tanggal asli, bukan tulisan "Forecast"
                        'actual' => null,
                        'prediction' => $product->min_threshold, 
                    ];
                }
            } elseif (isset($aiData['error'])) {
                $aiBriefing = "AI Note: " . $aiData['error'];
            }
        } catch (\Exception $e) {
            Log::error("AI Dashboard Error: " . $e->getMessage());
            $aiBriefing = "AI Engine is currently optimizing data.";
        }

        return Inertia::render('Dashboard', [
            'summary' => $summary,
            'recentLogs' => Transaction::with('product')->where('status', 'approved')->latest()->take(5)->get(),
            'chartData' => $chartData,
            'products' => Product::all(['id', 'name']),
            'selectedProductId' => (int)$selectedProductId,
            'aiBriefing' => $aiBriefing
        ]);
    }

    public function inventory()
    {
        // Mengambil data lengkap sesuai migrasi
        $products = \App\Models\Product::all()->map(function($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'category_id' => $product->category_id, // WAJIB ADA: Untuk kebutuhan Edit Form
                'current_stock' => $product->stock,
                'threshold' => $product->min_threshold,
                'price' => $product->unit_price,
                'status' => $product->status,
                'last_updated' => $product->updated_at->format('d M Y'),
            ];
        });

        // Mengambil daftar kategori untuk pilihan di modal
        $categories = \App\Models\Category::all();

        return Inertia::render('Inventory/Index', [
            'products' => $products,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {

        if ($request->user()->role === 'staff') {
            abort(403, 'Staff is not allowed to create products.');
        }

        // Validasi input sesuai dengan struktur migrasi kamu
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'sku'           => 'required|string|unique:products,sku',
            'category_id'   => 'required|exists:categories,id',
            'stock'         => 'required|integer|min:0',
            'min_threshold' => 'required|integer|min:0',
            'unit_price'    => 'required|numeric|min:0',
        ]);

        // Simpan ke database
        \App\Models\Product::create($validated);

        return redirect()->back()->with('success', 'Product added successfully!');
    }

    public function update(Request $request, $id)
    {
        // Proteksi Backend
        if ($request->user()->role === 'staff') {
            abort(403, 'Staff is not allowed to update products.');
        }
        
        $product = \App\Models\Product::findOrFail($id);
        
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'sku'           => 'required|string|unique:products,sku,'.$id,
            'category_id'   => 'required|exists:categories,id',
            'stock'         => 'required|integer|min:0',
            'min_threshold' => 'required|integer|min:0',
            'unit_price'    => 'required|numeric|min:0|max:99999999',
        ]);

        $product->update($validated);

        return redirect()->back()->with('success', 'Product updated successfully!');
    }

    public function destroy(Request $request, $id)
    {

        // Proteksi Backend
        if ($request->user()->role === 'staff') {
            abort(403, 'Staff is not allowed to delete products.');
        }

        $product = \App\Models\Product::findOrFail($id);
        $product->delete();

        return redirect()->back()->with('success', 'Product deleted successfully!');
    }
}