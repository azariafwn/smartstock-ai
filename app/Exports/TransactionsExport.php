<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable; // Tambahkan ini

class TransactionsExport implements FromCollection, WithHeadings, WithMapping
{
    use Exportable;

    protected $transactions;

    // Pastikan Constructor menerima koleksi data
    public function __construct($transactions)
    {
        $this->transactions = $transactions;
    }

    // Mengembalikan data ke Laravel Excel
    public function collection()
    {
        return $this->transactions;
    }

    /**
    * Mapping data per baris
    * Pastikan nama variabel di sini ($transaction) digunakan secara konsisten di dalam array
    */
    public function map($transaction): array
    {
        return [
            'SS-' . $transaction->id . 'AI',
            $transaction->created_at ? $transaction->created_at->format('d/m/Y H:i') : '-',
            $transaction->product->name ?? 'N/A',
            $transaction->product->sku ?? 'N/A',
            $transaction->type,
            ucfirst($transaction->category),
            $transaction->quantity,
            $transaction->user->name ?? 'System',
            ucfirst($transaction->status)
        ];
    }

    public function headings(): array
    {
        return [
            'Reference ID',
            'Date',
            'Product Name',
            'SKU',
            'Type',
            'Category',
            'Quantity',
            'Operator',
            'Status'
        ];
    }
}