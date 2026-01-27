<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable;

class ReportsExport implements FromCollection, WithHeadings, WithMapping
{
    use Exportable;

    protected $reports;

    // Constructor menerima data yang sudah difilter dari Controller
    public function __construct($reports)
    {
        $this->reports = $reports;
    }

    public function collection()
    {
        return $this->reports;
    }

    // Menentukan judul kolom di file Excel
    public function headings(): array
    {
        return [
            'ID Log',
            'Tanggal & Waktu',
            'Nama Produk',
            'SKU',
            'Operator',
            'Kategori Aktivitas',
            'Tipe',
            'Jumlah (Delta)',
        ];
    }

    // Mapping data agar sesuai dengan kolom database
    public function map($report): array
    {
        return [
            $report->id,
            $report->created_at ? $report->created_at->format('d/m/Y H:i:s') : '-',
            $report->product->name ?? 'N/A',
            $report->product->sku ?? 'N/A',
            $report->user->name ?? 'System',
            ucfirst($report->category), // sale, damaged, restock, dll
            $report->type, // IN atau OUT
            ($report->type === 'IN' ? '+' : '-') . $report->quantity,
        ];
    }
}