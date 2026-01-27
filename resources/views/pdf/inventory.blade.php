<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #0f172a; margin: 0; padding: 0; }
        .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
        .brand { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; }
        .brand-blue { color: #2563eb; }
        .subtitle { font-size: 14px; font-weight: bold; color: #1e293b; margin-top: 5px; text-transform: uppercase; border-left: 4px solid #2563eb; padding-left: 10px; }
        .timestamp { font-size: 10px; color: #94a3b8; margin-top: 10px; }

        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #1e293b; color: #ffffff; font-weight: bold; font-size: 9px; padding: 12px; text-transform: uppercase; text-align: left; }
        td { padding: 10px; border: 1px solid #f1f5f9; font-size: 11px; vertical-align: top; }
        
        .badge { padding: 3px 6px; border-radius: 4px; font-size: 8px; font-weight: 800; text-transform: uppercase; }
        .bg-active { background-color: #ecfdf5; color: #059669; border: 1px solid #10b981; }
        
        .footer { position: fixed; bottom: 0; width: 100%; text-align: right; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">SMART<span class="brand-blue">STOCK</span></div>
        <div class="subtitle">Warehouse Inventory Report</div>
        <div class="timestamp">Generated at: {{ now()->format('d F Y, H:i:s') }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Asset Name</th>
                <th>SKU</th>
                <th>Stock Level</th>
                <th>Unit Price</th>
                <th style="text-align: right;">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products as $p)
            <tr>
                <td><strong>{{ $p->name }}</strong></td>
                <td>{{ $p->sku }}</td>
                <td>{{ $p->stock ?? $p->current_stock ?? 0 }} Units</td>
                <td>Rp {{ number_format($p->unit_price ?? $p->price ?? 0, 0, ',', '.') }}</td>
                <td style="text-align: right;">
                    <span class="badge bg-active">{{ $p->status }}</span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">SmartStock AI System - Warehouse Node 01</div>
</body>
</html>