<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\Approval;
use App\Models\StockForecast;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Setup Users
        $superadmin = User::updateOrCreate(['email' => 'superadmin@smartstock.com'], [
            'name' => 'Super Admin', 'password' => Hash::make('password123'), 'role' => 'superadmin'
        ]);
        $admin = User::updateOrCreate(['email' => 'admin@smartstock.com'], [
            'name' => 'Admin Manager', 'password' => Hash::make('password123'), 'role' => 'admin'
        ]);
        $staff = User::updateOrCreate(['email' => 'staff@smartstock.com'], [
            'name' => 'Warehouse Staff', 'password' => Hash::make('password123'), 'role' => 'staff'
        ]);
        \App\Models\User::create([
            'name' => 'Demo Superadmin',
            'email' => 'superadmin@demo.com',
            'password' => Hash::make('password123'),
            'role' => 'superadmin',
        ]);

        // 2. Setup Categories & Products
        $categories = [
            'Electronics' => ['Laptop ThinkPad X1', 'LG UltraWide Monitor', 'Logitech MX Master', 'iPhone 15 Pro'],
            'Furniture' => ['Ergonomic Chair', 'Standing Desk', 'LED Desk Lamp', 'Bookshelf'],
            'Stationery' => ['Mechanical Pencil', 'A4 Paper Rim', 'Permanent Marker']
        ];

        $productModels = [];

        foreach ($categories as $catName => $items) {
            $category = Category::updateOrCreate(
                ['slug' => strtolower($catName)], 
                ['name' => $catName]
            );

            foreach ($items as $index => $itemName) {
                $productModels[] = Product::updateOrCreate(
                    ['sku' => strtoupper(substr($catName, 0, 3)) . "-00" . ($index + 1)],
                    [
                        'category_id' => $category->id,
                        'name' => $itemName,
                        'stock' => 100, // Mulai dari 100
                        'min_threshold' => 15,
                        'unit_price' => rand(100000, 5000000),
                        'status' => 'active'
                    ]
                );
            }
        }

        // 3. Realistic 30-Day History Simulation
        $this->command->info("Simulating 30 days of transactions with Stock Safety Logic...");
        
        foreach ($productModels as $product) {
            // Kita gunakan variabel tracking stok sementara khusus untuk seeder
            $runningStock = 100; 

            for ($i = 30; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);
                $numTransactions = rand(1, 2);
                
                for ($j = 0; $j < $numTransactions; $j++) {
                    // LOGIKA SAFETY: Jika stok running di bawah 30, PAKSA Restock (IN)
                    if ($runningStock < 30) {
                        $type = 'IN';
                        $category = 'distributed';
                        $qty = rand(40, 70); // Tambah stok dalam jumlah besar
                        $runningStock += $qty;
                    } else {
                        // Jika stok aman, peluang OUT lebih besar (70% OUT, 30% IN)
                        $type = (rand(1, 10) <= 7) ? 'OUT' : 'IN';
                        
                        if ($type === 'OUT') {
                            $chance = rand(1, 100);
                            if ($chance <= 90) { // 90% Penjualan Normal
                                $category = 'sale';
                                $qty = rand(5, 12);
                            } elseif ($chance <= 97) { // 7% Damaged
                                $category = 'damaged';
                                $qty = rand(1, 2);
                            } else { // 3% Lost
                                $category = 'lost';
                                $qty = 1;
                            }
                            $runningStock -= $qty;
                        } else {
                            $category = 'distributed';
                            $qty = rand(10, 30);
                            $runningStock += $qty;
                        }
                    }

                    // Buat Transaksi
                    $t = Transaction::create([
                        'product_id' => $product->id,
                        'user_id' => $staff->id,
                        'type' => $type,
                        'category' => $category,
                        'quantity' => $qty,
                        'status' => 'approved',
                        'created_at' => $date->copy()->addHours(rand(1, 23)),
                    ]);

                    // Buat Approval
                    Approval::create([
                        'transaction_id' => $t->id,
                        'requester_id' => $staff->id,
                        'approver_id' => $admin->id,
                        'status' => 'approved',
                        'notes' => 'Automated historical seed data',
                        'created_at' => $t->created_at,
                    ]);
                }
            }
            
            // Update stok akhir produk di database agar sesuai dengan runningStock simulasi
            $product->update(['stock' => $runningStock]);
        }

        // 4. Forecast Data
        $this->command->info("Generating 14-day AI Forecast...");
        foreach ($productModels as $product) {
            for ($i = 0; $i < 14; $i++) {
                StockForecast::create([
                    'product_id' => $product->id,
                    'forecast_date' => Carbon::now()->addDays($i),
                    'predicted_quantity' => rand($product->stock - 10, $product->stock + 20),
                    'accuracy_rate' => rand(85, 98) / 100,
                ]);
            }
        }

        // 5. Pending Requests
        // 5. Tambahkan beberapa transaksi PENDING agar dashboard tidak nol
        $this->command->info("Adding pending requests...");
        for ($k = 0; $k < 5; $k++) {
            // Simpan dulu transaksi ke variabel
            $tp = Transaction::create([
                'product_id' => $productModels[array_rand($productModels)]->id,
                'user_id' => $staff->id,
                'type' => 'OUT',
                'category' => 'sale',
                'quantity' => rand(2, 5),
                'status' => 'pending',
            ]);

            // Buat approval secara manual tanpa lewat relasi model agar aman
            Approval::create([
                'transaction_id' => $tp->id,
                'requester_id' => $staff->id,
                'status' => 'waiting',
            ]);
        }

        $this->command->info("Seeding completed! Stock levels are now safe and positive.");
    }
}