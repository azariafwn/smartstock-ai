<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $products;

    public function __construct($products)
    {
        $this->products = $products;
    }

    public function collection()
    {
        return $this->products;
    }

    public function headings(): array
    {
        return ['Name', 'SKU', 'Category', 'Stock', 'Price', 'Status'];
    }

    public function map($product): array
    {
        // COMMENT: Gunakan nama kolom asli di database (stock & unit_price)
        return [
            $product->name,
            $product->sku,
            $product->category->name ?? '-',
            $product->stock ?? 0, // Berubah dari current_stock ke stock
            'Rp ' . number_format($product->unit_price ?? 0, 0, ',', '.'), // Berubah dari price ke unit_price
            $product->status
        ];
    }
}